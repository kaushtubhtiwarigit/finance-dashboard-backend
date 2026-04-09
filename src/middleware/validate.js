const { validationResult, body } = require('express-validator');

// Run validation and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: { message: errors.array()[0].msg },
    });
  }
  next();
};

// Validation rules for register
const registerRules = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation rules for login
const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for creating/updating a record
const recordRules = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().isLength({ min: 2, max: 30 }).withMessage('Category must be 2-30 characters'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

// Validation rules for updating a record (all fields optional)
const recordUpdateRules = [
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().trim().isLength({ min: 2, max: 30 }).withMessage('Category must be 2-30 characters'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

// Validation for role update
const roleRules = [
  body('role').isIn(['VIEWER', 'ANALYST', 'ADMIN']).withMessage('Role must be VIEWER, ANALYST, or ADMIN'),
];

// Validation for status update
const statusRules = [
  body('isActive').isBoolean().withMessage('isActive must be true or false'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  recordRules,
  recordUpdateRules,
  roleRules,
  statusRules,
};
