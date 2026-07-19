const Razorpay = require('razorpay');
const crypto = require('crypto');
const { prisma } = require('../repositories/prisma');
const { ApiError } = require('../middlewares/error.middleware');
const { logger } = require('../utils/logger');
const config = require('../config/env');

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET
});

const initializePayment = async (booking) => {
  
  const amountInPaise = Math.round(booking.totalPrice * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: booking.id,
    notes: { bookingId: booking.id }
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: 'RAZORPAY',
      amount: booking.totalPrice,
      status: 'PENDING',
      transactionId: order.id
    }
  });

  return order;
};

const processWebhook = async (body, signature, secret) => {
  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new ApiError(400, 'Invalid webhook signature');
  }

  const event = body.event;
  if (event === 'payment.captured') {
    const paymentEntity = body.payload.payment.entity;
    const orderId = paymentEntity.order_id;

    await handleSuccessfulPayment(orderId, paymentEntity.id);
  }

  return true;
};

const handleSuccessfulPayment = async (orderId, paymentId) => {
  await prisma.$transaction(async (tx) => {
    // Find payment record
    const payment = await tx.payment.findFirst({ where: { transactionId: orderId } });
    if (!payment) return;

    // Update payment
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESS', paidAt: new Date() }
    });

    // Update booking
    const booking = await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' },
      include: { items: true }
    });

    // Generate Tickets
    const ticketsToCreate = [];
    for (const item of booking.items) {
      for (let i = 0; i < item.quantity; i++) {
        ticketsToCreate.push({ bookingItemId: item.id });
      }
    }

    await tx.ticket.createMany({ data: ticketsToCreate });

    logger.info(`Tickets successfully generated for Booking ${booking.id}`);
    // Future: Enqueue Email Worker here
  });
};

module.exports = { initializePayment, processWebhook };
