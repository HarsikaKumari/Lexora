// routes/services.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { prisma } = require('../utils/prisma');

const router = express.Router();

// GET /services — public, with filters
router.get('/', async (req, res) => {
  const {
    legal_issue,
    document_type,
    region,
    search,
    min_price,
    max_price,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    // Build filter conditions
    const where = {
      is_active: true,
      lawyer: {
        is_verified: true,
      },
    };

    if (legal_issue) {
      where.legal_issue = legal_issue;
    }

    if (document_type) {
      where.document_type = document_type;
    }

    if (region) {
      where.region = {
        contains: region,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price.gte = parseFloat(min_price);
      if (max_price) where.price.lte = parseFloat(max_price);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Execute queries in parallel
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          lawyer: {
            select: {
              id: true,
              name: true,
              email: true,
              region: true,
              is_verified: true,
              unique_identifier: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take,
      }),
      prisma.service.count({ where }),
    ]);

    // Format response
    const formattedServices = services.map((service) => ({
      ...service,
      lawyer_name: service.lawyer.name,
      lawyer_region: service.lawyer.region,
      lawyer_verified: service.lawyer.is_verified,
      total_bookings: service._count.bookings,
    }));

    res.json({
      services: formattedServices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /services/:id
router.get('/:id', async (req, res) => {
  const serviceId = parseInt(req.params.id);

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        lawyer: {
          select: {
            id: true,
            name: true,
            email: true,
            region: true,
            is_verified: true,
            unique_identifier: true,
            created_at: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
            booking_date: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          take: 5,
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST /services — lawyers only
router.post('/', authenticate, authorize('lawyer'), async (req, res) => {
  const {
    title,
    description,
    legal_issue,
    document_type,
    region,
    price,
    duration_minutes,
    is_active = true,
  } = req.body;

  // Validate required fields
  if (!title || !description || !price) {
    return res
      .status(400)
      .json({ error: 'Title, description, and price are required' });
  }

  try {
    // Check if lawyer is verified
    const lawyer = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { is_verified: true },
    });

    if (!lawyer.is_verified) {
      return res
        .status(403)
        .json({ error: 'Your account must be verified to create services' });
    }

    const service = await prisma.service.create({
      data: {
        lawyer_id: req.user.id,
        title,
        description,
        legal_issue: legal_issue || null,
        document_type: document_type || null,
        region: region || null,
        price: parseFloat(price),
        duration_minutes: duration_minutes || 60,
        is_active: is_active,
      },
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
    });

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT /services/:id — lawyers only (own services)
router.put('/:id', authenticate, authorize('lawyer'), async (req, res) => {
  const serviceId = parseInt(req.params.id);
  const {
    title,
    description,
    price,
    is_active,
    legal_issue,
    document_type,
    region,
    duration_minutes,
  } = req.body;

  try {
    // Check if service exists and belongs to the lawyer
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        lawyer_id: req.user.id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        error: 'Service not found or you do not have permission to update it',
      });
    }

    // Update service
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        is_active: is_active !== undefined ? is_active : undefined,
        legal_issue: legal_issue !== undefined ? legal_issue : null,
        document_type: document_type !== undefined ? document_type : null,
        region: region !== undefined ? region : null,
        duration_minutes:
          duration_minutes !== undefined ? duration_minutes : undefined,
      },
      include: {
        lawyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedService);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE /services/:id — lawyers only (delete own service)
router.delete('/:id', authenticate, authorize('lawyer'), async (req, res) => {
  const serviceId = parseInt(req.params.id);

  try {
    // Check if service exists and belongs to the lawyer
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        lawyer_id: req.user.id,
      },
      include: {
        bookings: {
          where: {
            status: { in: ['pending', 'confirmed'] },
          },
        },
      },
    });

    if (!existingService) {
      return res.status(404).json({
        error: 'Service not found or you do not have permission to delete it',
      });
    }

    // Check if there are active bookings
    if (existingService.bookings.length > 0) {
      return res.status(400).json({
        error:
          'Cannot delete service with active bookings. Consider marking it as inactive instead.',
      });
    }

    // Delete service
    await prisma.service.delete({
      where: { id: serviceId },
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// GET /services/lawyer/my-services — get lawyer's own services
router.get(
  '/lawyer/my-services',
  authenticate,
  authorize('lawyer'),
  async (req, res) => {
    try {
      const services = await prisma.service.findMany({
        where: {
          lawyer_id: req.user.id,
        },
        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
          bookings: {
            take: 3,
            orderBy: {
              created_at: 'desc',
            },
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      res.json(services);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch your services' });
    }
  },
);

// GET /services/categories/legal-issues — get distinct legal issues
router.get('/categories/legal-issues', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        is_active: true,
        legal_issue: { not: null },
      },
      select: {
        legal_issue: true,
      },
      distinct: ['legal_issue'],
    });

    const legalIssues = services.map((s) => s.legal_issue).filter(Boolean);
    res.json(legalIssues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch legal issues' });
  }
});

// GET /services/categories/document-types — get distinct document types
router.get('/categories/document-types', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        is_active: true,
        document_type: { not: null },
      },
      select: {
        document_type: true,
      },
      distinct: ['document_type'],
    });

    const documentTypes = services.map((s) => s.document_type).filter(Boolean);
    res.json(documentTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch document types' });
  }
});

// GET /services/regions — get distinct regions
router.get('/categories/regions', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        is_active: true,
        region: { not: null },
      },
      select: {
        region: true,
      },
      distinct: ['region'],
    });

    const regions = services.map((s) => s.region).filter(Boolean);
    res.json(regions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

module.exports = router;
