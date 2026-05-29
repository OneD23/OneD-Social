import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', details: err.flatten() });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate resource', details: err.keyValue });
  }

  const statusCode = err.statusCode || 500;
  const payload = { message: err.message || 'Internal server error' };
  if (err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  return res.status(statusCode).json(payload);
};
