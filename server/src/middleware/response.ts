import { Request, Response, NextFunction } from 'express';

/**
 * @desc Middleware to standardize API responses
 * Adds success() and error() methods to the response object
 */
export const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
  // Add success response method
  res.success = function(data: unknown = null, message = 'Success', statusCode = 200) {
    return this.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  };

  // Add error response method
  res.error = function(message = 'Error', statusCode = 500, code?: string, details?: unknown) {
    return this.status(statusCode).json({
      success: false,
      message,
      error: {
        code,
        details,
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  };

  next();
};

// Extend Express Response type to include custom methods
declare global {
  namespace Express {
    interface Response {
      success(data?: unknown, message?: string, statusCode?: number): Response;
      error(message?: string, statusCode?: number, code?: string, details?: unknown): Response;
    }
  }
} 