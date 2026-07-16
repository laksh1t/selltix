const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const data = await authService.refresh(req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh };
