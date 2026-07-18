const { prisma } = require('../repositories/prisma');
const { verifyEventOwnership } = require('./event.service');

const createTicketType = async (userId, eventId, data) => {
  await verifyEventOwnership(eventId, userId);
  
  return await prisma.ticketType.create({
    data: {
      eventId,
      ...data
    }
  });
};

const getTicketTypes = async (eventId) => {
  return await prisma.ticketType.findMany({
    where: { eventId, deletedAt: null }
  });
};

module.exports = { createTicketType, getTicketTypes };
