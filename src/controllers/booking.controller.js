const bookingService = require('../services/booking.service');
const paymentService = require('../services/payment.service');

const create = async (req, res, next) => {
  try {
    const { eventId, items } = req.body;
    const booking = await bookingService.createBooking(req.user.userId, eventId, items);

    const order = await paymentService.initializePayment(booking);

    res.status(201).json({ success: true, data: { booking, order } });
  } catch (error) {
    next(error);
  }
};

const { getPagination, formatPaginatedResponse } = require('../utils/pagination');

const getMine = async (req, res, next) => {
  try {
    const paginationParams = getPagination(req.query);
    const { items, total } = await bookingService.getMyBookings(req.user.userId, paginationParams);
    
    res.status(200).json({ 
      success: true, 
      data: formatPaginatedResponse(items, total, paginationParams.page, paginationParams.limit)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getMine };
