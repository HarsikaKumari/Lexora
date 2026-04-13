// routes/bookings.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { prisma } = require('../utils/prisma');

const router = express.Router();

// POST /api/bookings — clients only
router.post('/', authenticate, authorize('client'), async (req, res) => {
  const { service_id, booking_date, booking_time, notes } = req.body;

  try {
    // Combine date and time into a single DateTime object
    const bookingDateTime = new Date(`${booking_date}T${booking_time}`);

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: parseInt(service_id) },
      include: {
        lawyer: {
          select: { id: true, name: true },
        },
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        client_id: req.user.id,
        service_id: parseInt(service_id),
        booking_date: bookingDateTime,
        notes: notes || null,
        status: 'pending',
      },
      include: {
        service: {
          include: {
            lawyer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings/my — own bookings
router.get('/my', authenticate, async (req, res) => {
  try {
    let bookings;

    if (req.user.role === 'client') {
      // Get bookings made by the client
      bookings = await prisma.booking.findMany({
        where: {
          client_id: req.user.id,
        },
        include: {
          service: {
            include: {
              lawyer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  region: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Format the response for client view
      const formattedBookings = bookings.map((booking) => ({
        id: booking.id,
        service_id: booking.service_id,
        service_title: booking.service.title,
        price: booking.service.price,
        lawyer_name: booking.service.lawyer.name,
        lawyer_email: booking.service.lawyer.email,
        booking_date: booking.booking_date,
        notes: booking.notes,
        status: booking.status,
        created_at: booking.created_at,
      }));

      res.json(formattedBookings);
    } else {
      // Lawyer view - get bookings for their services
      bookings = await prisma.booking.findMany({
        where: {
          service: {
            lawyer_id: req.user.id,
          },
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          service: {
            select: {
              id: true,
              title: true,
              price: true,
              description: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Format the response for lawyer view
      const formattedBookings = bookings.map((booking) => ({
        id: booking.id,
        service_id: booking.service_id,
        service_title: booking.service.title,
        client_name: booking.client.name,
        client_email: booking.client.email,
        booking_date: booking.booking_date,
        notes: booking.notes,
        status: booking.status,
        created_at: booking.created_at,
      }));

      res.json(formattedBookings);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PATCH /api/bookings/:id/status — lawyer or admin
router.patch(
  '/:id/status',
  authenticate,
  authorize('lawyer', 'admin'),
  async (req, res) => {
    const { status } = req.body;
    const bookingId = parseInt(req.params.id);

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
      // First check if booking exists and user has permission
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          service: {
            select: {
              lawyer_id: true,
            },
          },
        },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check permission: admin can update any, lawyer only their own bookings
      if (
        req.user.role !== 'admin' &&
        booking.service.lawyer_id !== req.user.id
      ) {
        return res
          .status(403)
          .json({ error: 'You can only update your own service bookings' });
      }

      // Update booking status
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          service: {
            include: {
              lawyer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.json({
        message: `Booking status updated to ${status}`,
        booking: updatedBooking,
      });
    } catch (err) {
      console.error(err);
      if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(500).json({ error: 'Failed to update status' });
    }
  },
);

// GET /api/bookings/:id — get specific booking details
router.get('/:id', authenticate, async (req, res) => {
  const bookingId = parseInt(req.params.id);

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            region: true,
          },
        },
        service: {
          include: {
            lawyer: {
              select: {
                id: true,
                name: true,
                email: true,
                region: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization: client can see own bookings, lawyer can see their service bookings, admin can see all
    const isAuthorized =
      req.user.role === 'admin' ||
      booking.client_id === req.user.id ||
      booking.service.lawyer.id === req.user.id;

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to view this booking' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// DELETE /api/bookings/:id — cancel booking (client can cancel pending bookings)
router.delete('/:id', authenticate, async (req, res) => {
  const bookingId = parseInt(req.params.id);

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization: client can cancel their own pending bookings, admin can cancel any
    const isAuthorized =
      req.user.role === 'admin' ||
      (booking.client_id === req.user.id && booking.status === 'pending');

    if (!isAuthorized) {
      return res.status(403).json({
        error: 'You can only cancel your own pending bookings',
      });
    }

    // Delete or update status to cancelled
    if (req.user.role === 'admin') {
      await prisma.booking.delete({
        where: { id: bookingId },
      });
      res.json({ message: 'Booking deleted successfully' });
    } else {
      const cancelledBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' },
      });
      res.json({
        message: 'Booking cancelled successfully',
        booking: cancelledBooking,
      });
    }
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
