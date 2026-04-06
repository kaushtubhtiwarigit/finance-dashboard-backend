const recordService = require('../services/recordService');

const createRecord = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.user.id, req.body);
    res.status(201).json({ message: 'Record created', record });
  } catch (err) {
    next(err);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const filters = {
      type: req.query.type,
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const result = await recordService.getRecords(req.user.id, req.user.role, filters, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id, req.user.id, req.user.role);
    res.json({ record });
  } catch (err) {
    next(err);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.user.id, req.user.role, req.body);
    res.json({ message: 'Record updated', record });
  } catch (err) {
    next(err);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id, req.user.id, req.user.role);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };
