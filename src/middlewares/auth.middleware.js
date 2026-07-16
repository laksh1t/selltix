const { verifyAccessToken } = require('../utils/jwt');
const { ApiError } = require('./error.middleware');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token missing or invalid'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // Contains { userId, platformRole }
    next();
  } catch (error) {
    return next(new ApiError(401, 'Token expired or invalid'));
  }
};

module.exports = { requireAuth };
