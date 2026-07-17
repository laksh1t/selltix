const { prisma } = require('../repositories/prisma');

const createOrganization = async ({ name, ownerId }) => {
  const organization = await prisma.organization.create({
    data: { name, ownerId }
  });
  return organization;
};

const getMyOrganizations = async (ownerId, pagination) => {
  const where = { ownerId, deletedAt: null };
  const [total, items] = await prisma.$transaction([
    prisma.organization.count({ where }),
    prisma.organization.findMany({
      where,
      include: { events: { where: { deletedAt: null } } },
      skip: pagination.skip,
      take: pagination.take
    })
  ]);

  return { total, items };
};

module.exports = { createOrganization, getMyOrganizations };
