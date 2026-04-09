const Record = require('../models/Record');
const mongoose = require('mongoose');

const buildBaseQuery = (userId, userRole, startDate, endDate) => {
  const query = { isDeleted: false };

  if (userRole !== 'ADMIN') {
    query.createdBy = new mongoose.Types.ObjectId(userId);
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  return query;
};

const getOverallSummary = async (userId, userRole, startDate, endDate) => {
  const query = buildBaseQuery(userId, userRole, startDate, endDate);

  const result = await Record.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;

  result.forEach((item) => {
    if (item._id === 'income') totalIncome = item.total;
    if (item._id === 'expense') totalExpenses = item.total;
  });

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  };
};

const getCategorySummary = async (userId, userRole, startDate, endDate) => {
  const query = buildBaseQuery(userId, userRole, startDate, endDate);

  const result = await Record.aggregate([
    { $match: query },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.category': 1 } },
  ]);

  // Group by category and split into income/expense
  const categoryMap = {};
  result.forEach(({ _id, total }) => {
    const { category, type } = _id;
    if (!categoryMap[category]) {
      categoryMap[category] = { category, income: 0, expense: 0 };
    }
    categoryMap[category][type] = total;
  });

  return Object.values(categoryMap).map((c) => ({
    ...c,
    net: c.income - c.expense,
  }));
};

const getMonthlySummary = async (userId, userRole, year) => {
  const targetYear = parseInt(year) || new Date().getFullYear();
  const query = buildBaseQuery(userId, userRole, null, null);

  query.date = {
    $gte: new Date(`${targetYear}-01-01`),
    $lte: new Date(`${targetYear}-12-31`),
  };

  const result = await Record.aggregate([
    { $match: query },
    {
      $group: {
        _id: { month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  // Build all 12 months with defaults
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0,
    net: 0,
  }));

  result.forEach(({ _id, total }) => {
    const monthData = months[_id.month - 1];
    monthData[_id.type] = total;
  });

  months.forEach((m) => {
    m.net = m.income - m.expense;
  });

  return months;
};

module.exports = { getOverallSummary, getCategorySummary, getMonthlySummary };
