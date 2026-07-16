const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  let limit = Math.max(1, parseInt(query.limit, 10) || 12);
  
  if (limit > 100) {
    limit = 100;
  }
  
  const skip = (page - 1) * limit;
  
  return { page, limit, skip, take: limit };
};

const formatPaginatedResponse = (items, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    items,
    pagination: {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

module.exports = { getPagination, formatPaginatedResponse };
