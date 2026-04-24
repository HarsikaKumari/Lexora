// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../utils/prisma');
const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role, unique_identifier, region } = req.body;
  console.log('Registering user:🥺🥺🥺🥺', { name, email, role, unique_identifier, region });
  try {
    // Check if email exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user (lawyers start as unverified)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role: role.toLowerCase() || 'client',
        unique_identifier,
        region,
        is_verified: role === 'client',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_verified: true,
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /auth/me
router.get(
  '/me',
  require('../middleware/auth').authenticate,
  async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_verified: true,
          region: true,
        }
      });

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not fetch user' });
    }
  },
);

module.exports = router;