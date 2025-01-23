import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { APIError } from './error.js';
import { CONFIG } from '../config/index.js';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        tenantId?: string;
      };
    }
  }
}

/**
 * @desc Verifies JWT token and adds user info to request object
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new APIError('Authentication token required', 401, 'AUTH_TOKEN_MISSING');
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT.SECRET) as jwt.JwtPayload;
    req.user = decoded as Express.Request['user'];
    next();
  } catch (error) {
    throw new APIError('Invalid or expired token', 401, 'INVALID_TOKEN');
  }
};

/**
 * @desc Middleware to check if user has required role
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new APIError('User not authenticated', 401, 'USER_NOT_AUTHENTICATED');
    }

    if (!roles.includes(req.user.role)) {
      throw new APIError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    next();
  };
}; 