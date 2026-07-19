const paymentService = require('../services/payment.service');
const { logger } = require('../utils/logger');
const config = require('../config/env');

const webhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = config.RAZORPAY_WEBHOOK_SECRET;

    await paymentService.processWebhook(req.body, signature, secret);

    res.status(200).send('OK');
  } catch (error) {
    logger.error(error, 'Razorpay Webhook Error');
    res.status(400).send('Webhook verification failed');
  }
};

module.exports = { webhook };
