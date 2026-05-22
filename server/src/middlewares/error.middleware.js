import env from '../config/env.js';

// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle MySQL-specific errors
const handleMySQLError = (err) => {
  // Custom SIGNAL exceptions (like SQLSTATE '45000')
  if (err.sqlState === '45000') {
    return new AppError(err.sqlMessage || err.message, 400);
  }

  switch (err.code) {
    case 'ER_DUP_ENTRY':
      return new AppError('Duplicate entry found', 409);

    case 'ER_NO_REFERENCED_ROW_2':
    case 'ER_ROW_IS_REFERENCED_2':
      return new AppError('Related record not found or in use', 400);

    case 'ER_BAD_FIELD_ERROR':
      return new AppError('Invalid field in database query', 400);

    default:
      return new AppError('Database error occurred', 500);
  }
};

// Handle JWT errors
const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expired. Please login again', 401);

// Handle validation errors
const handleValidationError = (err) =>
  new AppError(`Validation error: ${err.message}`, 400);

// Dev error response — full details
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Prod error response — clean message only
const sendProdError = (err, res) => {
  if (err.isOperational) {
    // Trusted error — safe to send to client
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Unknown error — don't leak details
    console.error('💥 UNEXPECTED ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err.message);

  if (env.server.isDev) {
    sendDevError(err, res);
  } else {
    let error = { ...err, message: err.message };

    // MySQL errors
    if ((err.code && err.code.startsWith('ER_')) || err.sqlState) {
      error = handleMySQLError(err);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // Express validation errors
    if (err.name === 'ValidationError') error = handleValidationError(err);

    sendProdError(error, res);
  }
};

export { AppError, globalErrorHandler };
