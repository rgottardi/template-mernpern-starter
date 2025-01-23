import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { APIError } from './error';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new APIError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new APIError('User not authenticated', 401);
      }

      // Get user from database and check role
      // const user = await UserModel.findById(req.userId);
      // if (!user || !roles.includes(user.role)) {
      //   throw new APIError('Not authorized', 403);
      // }

      next();
    } catch (error) {
      next(error);
    }
  };
};