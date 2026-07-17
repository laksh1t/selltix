const { prisma } = require('../repositories/prisma');
const { ApiError } = require('../middlewares/error.middleware');

const verifyOrgOwnership = async (organizationId, userId) => {
  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!org || org.ownerId !== userId) {
    throw new ApiError(403, 'Forbidden: You do not own this organization');
  }
};

const verifyEventOwnership = async (eventId, userId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { organization: true }
  });
  if (!event || event.organization.ownerId !== userId) {
    throw new ApiError(403, 'Forbidden: You do not own this event');
  }
  return event;
};

const createEvent = async (userId, data) => {
  await verifyOrgOwnership(data.organizationId, userId);
  return await prisma.event.create({ data });
};

const getEvent = async (id) => {
  const event = await prisma.event.findUnique({
    where: { id, deletedAt: null },
    include: { ticketTypes: { where: { deletedAt: null } } }
  });
  if (!event) throw new ApiError(404, 'Event not found');
  return event;
};

const updateEvent = async (userId, eventId, data) => {
  await verifyEventOwnership(eventId, userId);
  return await prisma.event.update({
    where: { id: eventId },
    data
  });
};

const deleteEvent = async (userId, eventId) => {
  await verifyEventOwnership(eventId, userId);
  return await prisma.event.update({
    where: { id: eventId },
    data: { deletedAt: new Date() }
  });
};

const getEventBookings = async (userId, eventId, pagination) => {
  await verifyEventOwnership(eventId, userId);
  
  const [total, items] = await prisma.$transaction([
    prisma.booking.count({ where: { eventId } }),
    prisma.booking.findMany({
      where: { eventId },
      include: {
        user: { select: { name: true, email: true } },
        payments: true,
        items: {
          include: {
            ticketType: true,
            tickets: true
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

const getAllEvents = async (pagination) => {
  const where = { 
    deletedAt: null,
    status: 'PUBLISHED',
    startDate: { gte: new Date() }
  };

  const [total, items] = await prisma.$transaction([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      include: { organization: true },
      orderBy: { startDate: 'asc' },
      skip: pagination.skip,
      take: pagination.take
    })
  ]);

  return { total, items };
};

const getEventAnalytics = async (userId, eventId) => {
  await verifyEventOwnership(eventId, userId);

  const confirmedBookings = await prisma.booking.findMany({
    where: { eventId, status: 'CONFIRMED' },
    include: { items: true }
  });

  let revenue = 0;
  let ticketsSold = 0;
  confirmedBookings.forEach(booking => {
    revenue += booking.totalPrice;
    booking.items.forEach(item => {
      ticketsSold += item.quantity;
    });
  });

  const pendingBookings = await prisma.booking.count({
    where: { eventId, status: 'PENDING' }
  });

  const checkedIn = await prisma.ticket.count({
    where: { 
      status: 'USED',
      bookingItem: { booking: { eventId } }
    }
  });

  return {
    overview: {
      revenue,
      ticketsSold,
      checkedIn,
      pendingBookings
    }
  };
};

module.exports = { createEvent, getEvent, updateEvent, deleteEvent, verifyEventOwnership, getEventBookings, getEventAnalytics, getAllEvents };
