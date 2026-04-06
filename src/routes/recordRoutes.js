const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { recordRules, recordUpdateRules, validate } = require('../middleware/validate');

// All record routes require auth
router.use(auth);

router.post('/', authorize('ANALYST', 'ADMIN'), recordRules, validate, recordController.createRecord);
router.get('/', authorize('ANALYST', 'ADMIN'), recordController.getRecords);
router.get('/:id', authorize('ANALYST', 'ADMIN'), recordController.getRecordById);
router.put('/:id', authorize('ANALYST', 'ADMIN'), recordUpdateRules, validate, recordController.updateRecord);
router.delete('/:id', authorize('ANALYST', 'ADMIN'), recordController.deleteRecord);

module.exports = router;
