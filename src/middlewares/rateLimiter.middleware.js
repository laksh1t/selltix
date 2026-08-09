const rateLimit = require('express-rate-limit');

const createRateLimiter = ({ windowMs, max, message }) => rateLimit({
  windowMs,
  max,
  message: { success: false, error: message },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  skipSuccessfulRequests: false,
  handler: (req, res, next, options) => {
    res.set('Retry-After', Math.ceil(options.windowMs / 1000));
    res.status(429).json(options.message);
  }
});

module.exports = {
  registerLimiter: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many registration attempts. Try again later.'
  }),
  loginLimiter: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts. Try again later.'
  })
};