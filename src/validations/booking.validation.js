const { z } = require('zod');

const createBookingSchema = z.object({
  body: z.object({
    eventId: z.string().uuid(),
    items: z.array(z.object({
      ticketTypeId: z.string().uuid(),
      quantity: z.number().int().positive()
    })).min(1)
  })
});

const webhookSchema = z.any(); // Razorpay webhooks are validated via headers

module.exports = { createBookingSchema, webhookSchema };
