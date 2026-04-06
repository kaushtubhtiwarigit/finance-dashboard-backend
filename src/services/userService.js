const User = require('../models/User');

const getUsers = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();
  const users = await User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });

  return {
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return user;
};

const updateUserStatus = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true }
  ).select('-password');

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return user;
};

module.exports = { getUsers, updateUserRole, updateUserStatus };
