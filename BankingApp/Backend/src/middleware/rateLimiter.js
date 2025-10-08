const rateLimit = require('express-rate-limit');

// Get client IP 
const getClientIP = (req) => {
  return req.ip ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.connection?.remoteAddress ||
    'unknown';
};

// Registration limiter - prevent mass account creation
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registration attempts per windowMs
  message: {
    error: 'Too many registration attempts',
    message: 'Please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => getClientIP(req),
});

// Login limiter - prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 failed login attempts per windowMs
  message: {
    error: 'Too many login attempts',
    message: 'Please try again after 10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => {
    const email = (req.body?.email || req.body?.login || '').toLowerCase().trim();
    return `${getClientIP(req)}:${email}`; // Per-IP and per-email combination
  },
});

// General API limiter - protect all API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please slow down your requests'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req),
});

// Customer actions limiter - for payment creation, viewing, etc.
const customerActionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit to 10 customer actions per minute
  message: {
    error: 'Too many actions',
    message: 'Please slow down your requests'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req),
});

// Employee actions limiter - for payment verification, etc.
const employeeActionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit to 10 employee actions per minute
  message: {
    error: 'Too many actions',
    message: 'Please slow down your workflow'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req),
});

module.exports = {
  registerLimiter,
  loginLimiter,
  apiLimiter,
  customerActionLimiter,
  employeeActionLimiter
};