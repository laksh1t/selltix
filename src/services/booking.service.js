const { prisma } = require('../repositories/prisma');
const { ApiError } = require('../middlewares/error.middleware');

const createBooking = async (userId, eventId, items) => {
  return await prisma.$transaction(async (tx) => {
    let totalPrice = 0;
    const bookingItemsData = [];

    for (const item of items) {
      // 1. Atomically attempt to increment soldCount IF capacity allows
      // This is the core transactional inventory check that prevents overselling.
      const updatedCount = await tx.$executeRaw`
        UPDATE "TicketType" 
        SET "soldCount" = "soldCount" + ${item.quantity}, "updatedAt" = NOW()
        WHERE "id" = ${item.ticketTypeId} 
          AND "eventId" = ${eventId}
          AND "capacity" - "soldCount" >= ${item.quantity}
      `;

      if (updatedCount === 0) {
        throw new ApiError(400, 'Insufficient ticket capacity or invalid ticket type');
      }

      // 2. Fetch the ticket price to calculate totals safely on the backend
      const ticketType = await tx.ticketType.findUnique({ where: { id: item.ticketTypeId } });
      const itemTotal = ticketType.price * item.quantity;
      totalPrice += itemTotal;

      bookingItemsData.push({
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
        priceAtPurchase: ticketType.price
      });
    }

    // 3. Create the Booking with a 15-minute expiration
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const booking = await tx.booking.create({
      data: {
        userId,
        eventId,
        totalPrice,
        status: 'PENDING',
        expiresAt,
        items: {
          create: bookingItemsData
        }
      },
      include: { items: true }
    });

    return booking;
  });
};

const getMyBookings = async (userId, pagination) => {
  const where = { userId, status: 'CONFIRMED' };

  const [total, items] = await prisma.$transaction([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: {
        event: { select: { title: true, startDate: true, venue: true } },
        items: {
          include: {
            ticketType: { select: { name: true } },
            tickets: { select: { ticketCode: true, status: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take
    })
  ]);

  return { total, items };
};

module.exports = { createBooking, getMyBookings };
