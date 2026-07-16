const bcrypt = require('bcrypt');
const { prisma } = require('../repositories/prisma');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { ApiError } = require('../middlewares/error.middleware');

const register = async ({ email, password, name }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new ApiError(400, 'Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  });

  const tokens = generateTokens(user.id, user.platformRole, user.tokenVersion);

  return { user: { id: user.id, email: user.email, name: user.name, platformRole: user.platformRole }, tokens };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(401, 'Invalid credentials');

  const tokens = generateTokens(user.id, user.platformRole, user.tokenVersion);

  return { user: { id: user.id, email: user.email, name: user.name, platformRole: user.platformRole }, tokens };
};

const refresh = async ({ refreshToken }) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const tokens = generateTokens(user.id, user.platformRole, user.tokenVersion);
  return tokens;
};

module.exports = { register, login, refresh };
