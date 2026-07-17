const express = require('express');
const eventController = require('../controllers/event.controller');
const { validate } = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const eventValidation = require('../validations/event.validation');

const router = express.Router();

router.post('/', requireAuth, validate(eventValidation.createEventSchema), eventController.create);
router.get('/', eventController.getAll); // Public explore page
router.get('/:id', eventController.get); // Publicly accessible event page
router.patch('/:id', requireAuth, validate(eventValidation.updateEventSchema), eventController.update);
router.delete('/:id', requireAuth, eventController.remove);
router.get('/:id/bookings', requireAuth, eventController.getBookings);
router.get('/:id/analytics', requireAuth, eventController.getAnalytics);

module.exports = router;
