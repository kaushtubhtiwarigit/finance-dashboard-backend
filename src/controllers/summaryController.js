const summaryService = require('../services/summaryService');

const getOverallSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await summaryService.getOverallSummary(req.user.id, req.user.role, startDate, endDate);
    res.json(summary);
  } catch (err) {
    next(err);
  }
};

const getCategorySummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const categories = await summaryService.getCategorySummary(req.user.id, req.user.role, startDate, endDate);
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

const getMonthlySummary = async (req, res, next) => {
  try {
    const { year } = req.query;
    const months = await summaryService.getMonthlySummary(req.user.id, req.user.role, year);
    res.json({ months });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverallSummary, getCategorySummary, getMonthlySummary };
