const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const authValidation = require('../validations/auth.validation');
const { registerLimiter, loginLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.post('/register', registerLimiter, validate(authValidation.registerSchema), authController.register);
router.post('/login', loginLimiter, validate(authValidation.loginSchema), authController.login);
router.post('/refresh', validate(authValidation.refreshTokenSchema), authController.refresh);

module.exports = router;
