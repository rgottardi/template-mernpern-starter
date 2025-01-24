import { Request, Response, NextFunction } from 'express';
import { User, UserModel } from '../models/user.model.js';
import { generateTokens, verifyRefreshToken } from '../config/jwt.js';
import { APIError } from '../middleware/error.js';
import { logger } from '../config/logger.js';
import { Types } from 'mongoose';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, tenantId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError('Email already registered', 400, 'EMAIL_EXISTS');
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      tenantId,
      refreshTokenVersion: 0,
    }) as UserModel & { _id: Types.ObjectId };

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      refreshTokenVersion: user.refreshTokenVersion,
    });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.success({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password') as (UserModel & { _id: Types.ObjectId }) | null;
    if (!user) {
      throw new APIError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new APIError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Initialize or increment refresh token version
    if (typeof user.refreshTokenVersion !== 'number') {
      user.refreshTokenVersion = 0;
    }
    await user.save();

    logger.info('Login - Token Generation:', {
      userId: user._id.toString(),
      refreshTokenVersion: user.refreshTokenVersion
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      refreshTokenVersion: user.refreshTokenVersion,
    });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.success({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new APIError('Refresh token not found', 401, 'REFRESH_TOKEN_MISSING');
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded.userId || typeof decoded.version !== 'number') {
      throw new APIError('Invalid refresh token format', 401, 'INVALID_REFRESH_TOKEN');
    }

    logger.info('Refresh Token - Decoded Token:', {
      userId: decoded.userId,
      tokenVersion: decoded.version
    });

    // Find user and check token version
    const user = await User.findById(decoded.userId) as (UserModel & { _id: Types.ObjectId }) | null;
    if (!user) {
      throw new APIError('User not found', 401, 'USER_NOT_FOUND');
    }

    logger.info('Refresh Token - User Found:', {
      userId: user._id.toString(),
      userRefreshVersion: user.refreshTokenVersion
    });

    // Initialize refreshTokenVersion if it doesn't exist
    if (typeof user.refreshTokenVersion !== 'number') {
      user.refreshTokenVersion = 0;
      await user.save();
    }

    // Verify token version matches
    if (decoded.version !== user.refreshTokenVersion) {
      logger.error('Refresh Token - Version Mismatch:', {
        tokenVersion: decoded.version,
        userVersion: user.refreshTokenVersion
      });
      throw new APIError('Invalid refresh token version', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Generate new tokens with incremented version
    const newVersion = user.refreshTokenVersion + 1;
    user.refreshTokenVersion = newVersion;
    await user.save();

    logger.info('Refresh Token - New Version:', {
      userId: user._id.toString(),
      newVersion: newVersion
    });

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      refreshTokenVersion: newVersion,
    });

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.success({
      message: 'Token refreshed successfully',
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.success({
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}; 