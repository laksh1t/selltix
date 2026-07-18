const { z } = require('zod');

const createTicketTypeSchema = z.object({
  params: z.object({ eventId: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2),
    price: z.number().min(0),
    capacity: z.number().int().positive()
  })
});

module.exports = { createTicketTypeSchema };
