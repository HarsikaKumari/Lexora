// routes/documents.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { prisma } = require('../utils/prisma');

const router = express.Router();

// Document templates
const TEMPLATES = {
  affidavit: `AFFIDAVIT

I, {{client_name}}, residing at {{address}}, do hereby solemnly affirm and state as follows:

1. {{statement_1}}
2. {{statement_2}}

Verified on {{date}} at {{city}}.

Signature: _________________
Name: {{client_name}}
Date: {{date}}`,

  contract: `LEGAL AGREEMENT

This agreement is entered into on {{date}} between:

Party A: {{party_a_name}}, ({{party_a_address}})
Party B: {{party_b_name}}, ({{party_b_address}})

TERMS:
1. {{term_1}}
2. {{term_2}}
3. {{term_3}}

Both parties agree to the terms stated above.

Party A Signature: _______________ Date: {{date}}
Party B Signature: _______________ Date: {{date}}`,

  divorce_petition: `PETITION FOR DISSOLUTION OF MARRIAGE

Petitioner: {{petitioner_name}}
Respondent: {{respondent_name}}
Date of Marriage: {{marriage_date}}

Grounds for Dissolution:
{{grounds}}

Relief Requested:
{{relief_requested}}

Filed on: {{date}}
Petitioner Signature: _______________`,
};

// POST /documents/generate
router.post(
  '/generate',
  authenticate,
  authorize('client'),
  async (req, res) => {
    const { booking_id, document_type, template_data } = req.body;

    // Validate document type
    if (!TEMPLATES[document_type]) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    // Validate required fields
    const requiredFields = getRequiredFields(document_type);
    const missingFields = requiredFields.filter(
      (field) => !template_data[field],
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missingFields,
      });
    }

    // Fill template with provided data
    let content = TEMPLATES[document_type];
    Object.entries(template_data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || '');
    });

    // Add metadata to content
    content = `Document ID: DOC-${Date.now()}\nGenerated: ${new Date().toLocaleString()}\nType: ${document_type}\n\n${content}`;

    try {
      // Check if booking exists and belongs to the client
      if (booking_id) {
        const booking = await prisma.booking.findFirst({
          where: {
            id: parseInt(booking_id),
            client_id: req.user.id,
          },
        });

        if (!booking) {
          return res
            .status(404)
            .json({ error: 'Booking not found or does not belong to you' });
        }
      }

      // Create document in database
      const document = await prisma.document.create({
        data: {
          client_id: req.user.id,
          booking_id: booking_id ? parseInt(booking_id) : null,
          document_type: document_type,
          template_data: template_data,
          generated_content: content,
          status: 'generated',
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          booking: {
            include: {
              service: {
                select: {
                  title: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        ...document,
        content: document.generated_content,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Document generation failed' });
    }
  },
);

// GET /documents/my
router.get('/my', authenticate, async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        client_id: req.user.id,
      },
      select: {
        id: true,
        document_type: true,
        status: true,
        generated_content: true,
        created_at: true,
        updated_at: true,
        booking: {
          select: {
            id: true,
            status: true,
            booking_date: true,
            service: {
              select: {
                title: true,
                lawyer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET /documents/:id
router.get('/:id', authenticate, async (req, res) => {
  const documentId = parseInt(req.params.id);

  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        client_id: req.user.id,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            region: true,
          },
        },
        booking: {
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
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// GET /documents/:id/download
router.get('/:id/download', authenticate, async (req, res) => {
  const documentId = parseInt(req.params.id);

  try {
    const document = await prisma.document.findFirst({
      where: { id: documentId, client_id: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filename = `document_${documentId}_${document.document_type}.txt`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition'); // ← add this
    res.send(document.generated_content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// PUT /documents/:id
router.put('/:id', authenticate, authorize('client'), async (req, res) => {
  const documentId = parseInt(req.params.id);
  const { template_data } = req.body;

  try {
    // First check if document exists and belongs to user
    const existingDoc = await prisma.document.findFirst({
      where: {
        id: documentId,
        client_id: req.user.id,
      },
    });

    if (!existingDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Regenerate content with new template data
    let content = TEMPLATES[existingDoc.document_type];
    Object.entries(template_data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || '');
    });

    // Update document
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        template_data: template_data,
        generated_content: content,
        status: 'updated',
      },
    });

    res.json({
      message: 'Document updated successfully',
      document: updatedDocument,
      content: updatedDocument.generated_content,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// DELETE /documents/:id
router.delete('/:id', authenticate, async (req, res) => {
  const documentId = parseInt(req.params.id);

  try {
    // Check if document exists and belongs to user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        client_id: req.user.id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// GET /documents/templates/:type
router.get('/templates/:type', authenticate, async (req, res) => {
  const { type } = req.params;

  if (!TEMPLATES[type]) {
    return res.status(404).json({ error: 'Template not found' });
  }

  // Get required fields for the template
  const requiredFields = getRequiredFields(type);

  res.json({
    template_type: type,
    template_content: TEMPLATES[type],
    required_fields: requiredFields,
    sample_data: getSampleData(type),
  });
});

// GET /documents/templates/list
router.get('/templates/list', authenticate, async (req, res) => {
  const templateList = Object.keys(TEMPLATES).map((type) => ({
    type: type,
    name: formatTemplateName(type),
    description: getTemplateDescription(type),
    required_fields: getRequiredFields(type),
  }));

  res.json(templateList);
});

// Helper Functions
function getRequiredFields(documentType) {
  const fields = {
    affidavit: [
      'client_name',
      'address',
      'statement_1',
      'statement_2',
      'date',
      'city',
    ],
    contract: [
      'date',
      'party_a_name',
      'party_a_address',
      'party_b_name',
      'party_b_address',
      'term_1',
      'term_2',
      'term_3',
    ],
    divorce_petition: [
      'petitioner_name',
      'respondent_name',
      'marriage_date',
      'grounds',
      'relief_requested',
      'date',
    ],
  };
  return fields[documentType] || [];
}

function getSampleData(documentType) {
  const samples = {
    affidavit: {
      client_name: 'John Doe',
      address: '123 Main Street, Cityville',
      statement_1:
        'I am the legal owner of the property located at 123 Main Street.',
      statement_2: 'I have not transferred ownership to any other party.',
      date: '2024-01-15',
      city: 'Cityville',
    },
    contract: {
      date: '2024-01-15',
      party_a_name: 'John Smith',
      party_a_address: '456 Oak Avenue, Townsville',
      party_b_name: 'Jane Wilson',
      party_b_address: '789 Pine Road, Villagetown',
      term_1: 'Payment of $5000 to be made within 30 days.',
      term_2: 'Services to be completed by March 1, 2024.',
      term_3: 'Both parties agree to confidentiality.',
    },
    divorce_petition: {
      petitioner_name: 'Sarah Johnson',
      respondent_name: 'Michael Johnson',
      marriage_date: '2015-06-10',
      grounds:
        'Irreconcilable differences have led to the breakdown of the marriage.',
      relief_requested:
        'Dissolution of marriage, equitable distribution of assets, and spousal support.',
      date: '2024-01-15',
    },
  };
  return samples[documentType] || {};
}

function formatTemplateName(type) {
  const names = {
    affidavit: 'Affidavit',
    contract: 'Legal Contract/Agreement',
    divorce_petition: 'Divorce Petition',
  };
  return names[type] || type;
}

function getTemplateDescription(type) {
  const descriptions = {
    affidavit:
      'A sworn written statement used as evidence in legal proceedings',
    contract: 'A legally binding agreement between two or more parties',
    divorce_petition: 'Legal document filed to initiate divorce proceedings',
  };
  return descriptions[type] || 'Legal document template';
}

module.exports = router;
