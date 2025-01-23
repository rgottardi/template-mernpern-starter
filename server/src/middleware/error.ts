import { ErrorRequestHandler } from 'express';
import { logger } from '../config/logger.js';

// Custom error class for API errors
export class APIError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status = 500, code?: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Default to 500 server error
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details
  logger.error(`[${status}] ${message}`, {
    error: {
      name: err.name,
      message: err.message,
      status: err.status,
      code: err.code,
      details: err.details,
      stack: err.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      headers: {
        ...req.headers,
        authorization: req.headers.authorization ? '[REDACTED]' : undefined,
      },
    },
  });

  // Send error response
  res.status(status).json({
    error: {
      message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && {
        details: err.details,
        stack: err.stack,
      }),
    },
  });
};