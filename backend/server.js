const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const documentRoutes = require('./routes/documents');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      'https://lexora-xi-liart.vercel.app',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'], // Add this
});

// Store online users
const onlineUsers = new Map(); // userId -> socketId

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log('🔐 Auth middleware - Token received:', token ? 'Yes' : 'No');

  if (!token) {
    console.log('❌ No token provided');
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    console.log('✅ User authenticated:', socket.user.id, socket.user.role);
    next();
  } catch (err) {
    console.log('❌ Invalid token:', err.message);
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.user.id} (${socket.user.role})`);
  console.log(`📡 Socket ID: ${socket.id}`);

  // Store user online
  onlineUsers.set(socket.user.id, socket.id);
  console.log(`👥 Online users: ${Array.from(onlineUsers.keys()).join(', ')}`);

  // Broadcast online status
  io.emit('user_online', { userId: socket.user.id, role: socket.user.role });

  // Join personal room
  socket.join(`user_${socket.user.id}`);

  // Handle private message
  socket.on('private_message', async (data, callback) => {
    console.log('📨 Received private_message event');
    console.log('📦 Raw data:', JSON.stringify(data, null, 2));

    const { toUserId, message, bookingId } = data;
    const fromUserId = socket.user.id;

    // Validation
    if (!toUserId || !message) {
      console.log('❌ Missing required fields');
      const error = { error: 'Missing toUserId or message' };
      if (callback) callback(error);
      socket.emit('message_error', error);
      return;
    }

    console.log(`📤 From: ${fromUserId} (${socket.user.name})`);
    console.log(`📥 To: ${toUserId}`);
    console.log(`💬 Message: ${message}`);

    try {
      // Import prisma
      const { prisma } = require('./utils/prisma');

      // Save to database
      const savedMessage = await prisma.chatMessage.create({
        data: {
          from_user_id: fromUserId,
          to_user_id: parseInt(toUserId),
          booking_id: bookingId ? parseInt(bookingId) : null,
          message: message,
          is_read: false,
        },
        include: {
          from_user: {
            select: { id: true, name: true, role: true }
          }
        }
      });

      console.log(`✅ Message saved to DB with ID: ${savedMessage.id}`);

      // Send acknowledgment back to sender
      if (callback) {
        callback({ success: true, messageId: savedMessage.id });
      }

      // Send confirmation to sender
      socket.emit('message_sent', savedMessage);

      // Send to recipient if online
      const recipientSocketId = onlineUsers.get(parseInt(toUserId));
      if (recipientSocketId) {
        console.log(`📤 Sending to recipient (${toUserId}) via socket: ${recipientSocketId}`);
        io.to(recipientSocketId).emit('private_message', savedMessage);
      } else {
        console.log(`⚠️ Recipient ${toUserId} is offline, message stored in DB`);
      }

    } catch (error) {
      console.error('❌ Database error:', error);
      console.error('Error details:', error.message);

      const errorResponse = { error: error.message };
      if (callback) callback(errorResponse);
      socket.emit('message_error', errorResponse);
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { toUserId, isTyping } = data;
    console.log(`⌨️ Typing: User ${socket.user.id} is ${isTyping ? 'typing' : 'stopped typing'} to ${toUserId}`);

    const recipientSocketId = onlineUsers.get(parseInt(toUserId));
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', {
        fromUserId: socket.user.id,
        fromName: socket.user.name,
        isTyping,
      });
    }
  });

  // Mark messages as read
  socket.on('mark_read', async (data) => {
    const { fromUserId } = data;
    console.log(`📖 Marking messages as read from ${fromUserId} to ${socket.user.id}`);

    try {
      const { prisma } = require('./utils/prisma');
      const result = await prisma.chatMessage.updateMany({
        where: {
          from_user_id: parseInt(fromUserId),
          to_user_id: socket.user.id,
          is_read: false,
        },
        data: { is_read: true },
      });

      console.log(`✅ Marked ${result.count} messages as read`);
      socket.emit('messages_marked_read', { fromUserId });
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.user.id);
    io.emit('user_offline', { userId: socket.user.id });
    console.log(`❌ User disconnected: ${socket.user.id}`);
    console.log(`👥 Remaining online users: ${Array.from(onlineUsers.keys()).join(', ')}`);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`🔴 Socket error for user ${socket.user.id}:`, error);
  });
});

// CORS middleware for HTTP requests
app.use(
  cors({
    origin: [
      'https://lexora-xi-liart.vercel.app',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/documents', documentRoutes);
app.use('/admin', adminRoutes);
app.use('/chat', chatRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'LegalConnect API running' }));

// Test route to check users
app.get('/api/users', async (req, res) => {
  try {
    const { prisma } = require('./utils/prisma');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/test-insert', async (req, res) => {
  try {
    const { prisma } = require('./utils/prisma');

    // ✅ Ab sahi IDs use kar
    const lawyerId = 10;   // harsika (lawyer)
    const clientId = 9;    // abc (client)

    const newMessage = await prisma.chatMessage.create({
      data: {
        from_user_id: lawyerId,
        to_user_id: clientId,
        message: "Hello from Lawyer harsika! " + new Date().toLocaleTimeString(),
        is_read: false
      },
      include: {
        from_user: { select: { id: true, name: true, role: true } },
        to_user: { select: { id: true, name: true, role: true } }
      }
    });

    res.json({ success: true, message: newMessage });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Route to see all messages
app.get('/api/all-messages', async (req, res) => {
  try {
    const { prisma } = require('./utils/prisma');
    const messages = await prisma.chatMessage.findMany({
      include: {
        from_user: { select: { id: true, name: true, role: true } },
        to_user: { select: { id: true, name: true, role: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ count: messages.length, messages });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get('/api/debug-user', async (req, res) => {
  try {
    const { prisma } = require('./utils/prisma');

    // Check all messages
    const allMessages = await prisma.chatMessage.findMany();

    // Check users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({
      messages: allMessages,
      users: users,
      messageCount: allMessages.length
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get('/api/users-list', async (req, res) => {
  try {
    const { prisma } = require('./utils/prisma');
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (error) {
    res.json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
});