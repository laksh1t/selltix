const eventService = require('../services/event.service');

const create = async (req, res, next) => {
  try {
    const data = await eventService.createEvent(req.user.userId, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const data = await eventService.getEvent(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const { getPagination, formatPaginatedResponse } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const paginationParams = getPagination(req.query);
    const { items, total } = await eventService.getAllEvents(paginationParams);
    
    res.status(200).json({ 
      success: true, 
      data: formatPaginatedResponse(items, total, paginationParams.page, paginationParams.limit)
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await eventService.updateEvent(req.user.userId, req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const data = await eventService.deleteEvent(req.user.userId, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const paginationParams = getPagination(req.query);
    const { items, total } = await eventService.getEventBookings(req.user.userId, req.params.id, paginationParams);
    
    res.status(200).json({ 
      success: true, 
      data: formatPaginatedResponse(items, total, paginationParams.page, paginationParams.limit)
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const data = await eventService.getEventAnalytics(req.user.userId, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, get, getAll, update, remove, getBookings, getAnalytics };
