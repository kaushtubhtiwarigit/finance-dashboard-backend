// Usage: authorize('ADMIN') or authorize('ADMIN', 'ANALYST')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    next();
  };
};

module.exports = authorize;
