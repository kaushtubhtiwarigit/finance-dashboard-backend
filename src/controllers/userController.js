const userService = require('../services/userService');

const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const result = await userService.getUsers(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const user = await userService.updateUserStatus(req.params.id, req.body.isActive);
    res.json({ message: 'Status updated successfully', user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUserRole, updateUserStatus };
