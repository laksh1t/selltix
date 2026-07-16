const { logger } = require('../utils/logger');

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  logger.error(err, 'Unhandled Exception');
  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
};

module.exports = { ApiError, errorHandler };
