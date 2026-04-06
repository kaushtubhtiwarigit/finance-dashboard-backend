const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { roleRules, statusRules, validate } = require('../middleware/validate');

// All user management routes require auth + ADMIN role
router.use(auth, authorize('ADMIN'));

router.get('/', userController.getUsers);
router.put('/:id/role', roleRules, validate, userController.updateUserRole);
router.put('/:id/status', statusRules, validate, userController.updateUserStatus);

module.exports = router;
