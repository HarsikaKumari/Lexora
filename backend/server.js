const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const documentRoutes = require('./routes/documents');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173', // No trailing slash
      'http://127.0.0.1:5173', // Add both localhost and 127.0.0.1
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'LegalConnect API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
