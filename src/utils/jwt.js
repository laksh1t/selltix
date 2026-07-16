const jwt = require('jsonwebtoken');
const config = require('../config/env');

const ACCESS_SECRET = config.JWT_ACCESS_SECRET;
const REFRESH_SECRET = config.JWT_REFRESH_SECRET;

const generateTokens = (userId, platformRole, tokenVersion) => {
  const accessToken = jwt.sign(
    { userId, platformRole },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, tokenVersion },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken };
