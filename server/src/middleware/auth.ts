import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt.js';
import { APIError } from './error.js';
import { User } from '../models/user.model.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    tenantId?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new APIError('No token provided', 401, 'TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new APIError('User not found', 401, 'USER_NOT_FOUND');
    }

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new APIError('User not authenticated', 401, 'NOT_AUTHENTICATED');
      }

      if (!roles.includes(req.user.role)) {
        throw new APIError('Not authorized', 403, 'NOT_AUTHORIZED');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};