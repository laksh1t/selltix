const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', validate(authValidation.registerSchema), authController.register);
router.post('/login', validate(authValidation.loginSchema), authController.login);
router.post('/refresh', validate(authValidation.refreshTokenSchema), authController.refresh);

module.exports = router;
