const { z } = require('zod');

const createEventSchema = z.object({
  body: z.object({
    organizationId: z.string().uuid(),
    title: z.string().min(3),
    description: z.string().optional(),
    venue: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    capacity: z.number().int().positive().optional(),
    bannerUrl: z.string().url().optional()
  })
});

const updateEventSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    venue: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    capacity: z.number().int().positive().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
    bannerUrl: z.string().url().optional()
  })
});

module.exports = { createEventSchema, updateEventSchema };
