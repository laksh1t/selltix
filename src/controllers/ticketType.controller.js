const ticketTypeService = require('../services/ticketType.service');

const create = async (req, res, next) => {
  try {
    const data = await ticketTypeService.createTicketType(req.user.userId, req.params.eventId, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const data = await ticketTypeService.getTicketTypes(req.params.eventId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll };
