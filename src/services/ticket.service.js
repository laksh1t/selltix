const { prisma } = require('../repositories/prisma');
const { ApiError } = require('../middlewares/error.middleware');
const { verifyEventOwnership } = require('./event.service');

const checkInTicket = async (userId, ticketCode) => {
  // 1. Initial lookup to verify ownership (outside transaction to avoid connection pool deadlocks)
  const initialTicket = await prisma.ticket.findUnique({
    where: { ticketCode },
    include: { bookingItem: { include: { booking: true } } }
  });

  if (!initialTicket) {
    throw new ApiError(404, 'Ticket not found');
  }

  const eventId = initialTicket.bookingItem.booking.eventId;
  await verifyEventOwnership(eventId, userId);

  // 2. Atomic Transaction
  return await prisma.$transaction(async (tx) => {
    // Re-fetch inside transaction for data integrity and locking
    const ticket = await tx.ticket.findUnique({
      where: { ticketCode }
    });

    if (ticket.status === 'USED') {
      throw new ApiError(400, 'Ticket has already been scanned');
    }
    if (ticket.status !== 'VALID') {
      throw new ApiError(400, `Ticket is ${ticket.status}`);
    }

    // Create Attendance
    const attendance = await tx.attendance.create({
      data: {
        ticketId: ticket.id,
        checkedInBy: userId
      }
    });

    // Update Ticket
    await tx.ticket.update({
      where: { id: ticket.id },
      data: { status: 'USED' }
    });

    return attendance;
  });
};

module.exports = { checkInTicket };
