const { z } = require('zod');

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),
  RAZORPAY_WEBHOOK_SECRET: z.string(),
  LOG_LEVEL: z.string().default('info')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed.');
  console.error('Missing or invalid variables:');

  parsed.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join('.')}`);
  });

  process.exit(1);
}

module.exports = parsed.data;
