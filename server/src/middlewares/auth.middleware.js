import jwt from 'jsonwebtoken';

import callProcedure from '../config/callProcedure.js';
import env from '../config/env.js';
import { AppError } from './error.middleware.js';

const protect = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Access denied. No token provided', 401));
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, env.jwt.secret);

    const [rows] = await callProcedure('sp_GetUserById', [decoded.id]);
    const user = rows[0];

    if (!user) return next(new AppError('User not found.', 401));

    // 4. Attach user payload to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please login again', 401));
    }
    return next(new AppError('Invalid token. Please login again', 401));
  }
};

// Role-based access control
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission for this action', 403)
      );
    }
    next();
  };

export { protect, restrictTo };
