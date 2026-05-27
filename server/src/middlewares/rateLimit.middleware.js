import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    message:
      'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for password reset routes
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per `window` (here, per hour)
  message: {
    success: false,
    message:
      'Too many password reset requests from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
