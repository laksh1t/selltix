const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/:ticketCode/checkin', requireAuth, ticketController.checkIn);

module.exports = router;
