const express = require('express');
const bookingController = require('../controllers/booking.controller');
const paymentController = require('../controllers/payment.controller');
const { validate } = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const bookingValidation = require('../validations/booking.validation');

const router = express.Router();

router.post('/', requireAuth, validate(bookingValidation.createBookingSchema), bookingController.create);
router.get('/me', requireAuth, bookingController.getMine);
router.post('/webhook', paymentController.webhook);

module.exports = router;
