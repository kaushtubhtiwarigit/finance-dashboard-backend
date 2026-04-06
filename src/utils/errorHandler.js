// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({ error: { message: 'Email already registered' } });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)[0].message;
    return res.status(400).json({ error: { message } });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({ error: { message: 'Resource not found' } });
  }

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({ error: { message } });
};

module.exports = errorHandler;
