const Record = require('../models/Record');

const createRecord = async (userId, data) => {
  const record = await Record.create({ ...data, createdBy: userId });
  return record;
};

const getRecords = async (userId, userRole, filters, page, limit) => {
  const query = { isDeleted: false };

  // ADMIN sees all records, others see only their own
  if (userRole !== 'ADMIN') {
    query.createdBy = userId;
  }

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = new RegExp(filters.category, 'i');
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  const skip = (page - 1) * limit;
  const total = await Record.countDocuments(query);
  const records = await Record.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email');

  return {
    records,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

const getRecordById = async (recordId, userId, userRole) => {
  const record = await Record.findOne({ _id: recordId, isDeleted: false }).populate('createdBy', 'name email');

  if (!record) {
    const err = new Error('Record not found');
    err.status = 404;
    throw err;
  }

  if (userRole !== 'ADMIN' && record.createdBy._id.toString() !== userId) {
    const err = new Error('You can only access your own records');
    err.status = 403;
    throw err;
  }

  return record;
};

const updateRecord = async (recordId, userId, userRole, updates) => {
  const record = await Record.findOne({ _id: recordId, isDeleted: false });

  if (!record) {
    const err = new Error('Record not found');
    err.status = 404;
    throw err;
  }

  if (userRole !== 'ADMIN' && record.createdBy.toString() !== userId) {
    const err = new Error('You can only access your own records');
    err.status = 403;
    throw err;
  }

  const allowed = ['amount', 'type', 'category', 'date', 'notes'];
  allowed.forEach((field) => {
    if (updates[field] !== undefined) record[field] = updates[field];
  });

  await record.save();
  return record;
};

const deleteRecord = async (recordId, userId, userRole) => {
  const record = await Record.findOne({ _id: recordId, isDeleted: false });

  if (!record) {
    const err = new Error('Record not found');
    err.status = 404;
    throw err;
  }

  if (userRole !== 'ADMIN' && record.createdBy.toString() !== userId) {
    const err = new Error('You can only access your own records');
    err.status = 403;
    throw err;
  }

  record.isDeleted = true;
  await record.save();
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
