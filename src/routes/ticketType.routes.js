const express = require('express');
const ticketTypeController = require('../controllers/ticketType.controller');
const { validate } = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const ticketTypeValidation = require('../validations/ticketType.validation');

const router = express.Router({ mergeParams: true }); // Need mergeParams to get eventId from parent route

router.post('/', requireAuth, validate(ticketTypeValidation.createTicketTypeSchema), ticketTypeController.create);
router.get('/', ticketTypeController.getAll); // Public route to fetch tickets for an event

module.exports = router;
