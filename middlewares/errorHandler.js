/**
 * Global error handling middleware
 */

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry detected';
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    statusCode = 500;
    message = 'Database table not found. Please run the schema.sql script';
  }

  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database connection failed. Please check your database configuration';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Not found middleware for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
}

module.exports = {
  errorHandler,
  notFound,
  AppError
};
