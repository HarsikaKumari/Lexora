const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { prisma } = require('../utils/prisma');

const router = express.Router();

// GET /admin/users — all users
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_verified: true,
        unique_identifier: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PATCH /admin/users/:id/verify — verify a lawyer
router.patch(
  '/users/:id/verify',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    const { is_verified } = req.body;
    const userId = parseInt(req.params.id); // Convert to integer

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { is_verified: is_verified },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_verified: true,
        },
      });

      res.json(updatedUser);
    } catch (err) {
      // Handle case where user doesn't exist
      if (err.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
      console.error(err);
      res.status(500).json({ error: 'Verification failed' });
    }
  },
);

// GET /admin/stats
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Run all count queries in parallel using Prisma
    const [total_users, total_services, total_bookings] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(), // Assuming you have a service model
      prisma.booking.count(), // Assuming you have a booking model
    ]);

    res.json({
      total_users,
      total_services,
      total_bookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
