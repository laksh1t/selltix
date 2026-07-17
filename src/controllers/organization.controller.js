const orgService = require('../services/organization.service');

const create = async (req, res, next) => {
  try {
    const data = await orgService.createOrganization({
      name: req.body.name,
      ownerId: req.user.userId
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const { getPagination, formatPaginatedResponse } = require('../utils/pagination');

const getMine = async (req, res, next) => {
  try {
    const paginationParams = getPagination(req.query);
    const { items, total } = await orgService.getMyOrganizations(req.user.userId, paginationParams);
    
    res.status(200).json({ 
      success: true, 
      data: formatPaginatedResponse(items, total, paginationParams.page, paginationParams.limit)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getMine };
