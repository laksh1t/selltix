const { z } = require('zod');

const createOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
  }),
});

module.exports = { createOrgSchema };
