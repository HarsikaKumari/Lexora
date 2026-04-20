const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const documentRoutes = require('./routes/documents');
const adminRoutes = require('./routes/admin');

const app = express();
const publicUri=process.env.PUBLIC_URI;
app.use(
  cors({
    origin: [
      'https://lexora-xi-liart.vercel.app', // WITHOUT trailing slash
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS important hai
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow headers
  })
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
