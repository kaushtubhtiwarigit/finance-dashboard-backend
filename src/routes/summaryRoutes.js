const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const auth = require('../middleware/auth');

// All roles can access summaries
router.use(auth);

router.get('/', summaryController.getOverallSummary);
router.get('/category', summaryController.getCategorySummary);
router.get('/monthly', summaryController.getMonthlySummary);

module.exports = router;
