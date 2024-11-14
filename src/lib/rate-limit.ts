import { rateLimit } from 'express-rate-limit';

export const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  limit: 100, // Limit each IP to 100 requests per day
  standardHeaders: 'draft-7', // Returns RateLimit header
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again in 24 hours',
    details: 'Rate limit: 200 requests per day',
  },
});
