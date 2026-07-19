const ticketService = require('../services/ticket.service');

const checkIn = async (req, res, next) => {
  try {
    const { ticketCode } = req.params;
    const data = await ticketService.checkInTicket(req.user.userId, ticketCode);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkIn };
