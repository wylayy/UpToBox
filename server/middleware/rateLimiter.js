const rateLimit = require('express-rate-limit');

// Upload rate limiter - 10 files per hour per IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'Too many uploads from this IP, please try again later. Limit: 10 files per hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Download rate limiter - 50 downloads per hour per IP
const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: {
    error: 'Too many downloads from this IP, please try again later. Limit: 50 downloads per hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiter - 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  uploadLimiter,
  downloadLimiter,
  apiLimiter
};
