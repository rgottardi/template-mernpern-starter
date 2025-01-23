import jwt from 'jsonwebtoken';
import { APIError } from '../middleware/error.js';
import { CONFIG } from './index.js';

console.log('JWT Config:', {
  secret: CONFIG.JWT.SECRET,
  refreshSecret: CONFIG.JWT.REFRESH_SECRET,
  env: process.env.NODE_ENV,
  envPath: process.cwd()
});

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  tenantId?: string;
}

interface RefreshTokenPayload {
  userId: string;
  version: number;
}

// Ensure JWT secrets are defined
if (!CONFIG.JWT.SECRET || !CONFIG.JWT.REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables');
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(
    payload,
    CONFIG.JWT.SECRET as jwt.Secret,
    { expiresIn: CONFIG.JWT.EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: payload.userId, version: Date.now() },
    CONFIG.JWT.REFRESH_SECRET as jwt.Secret,
    { expiresIn: CONFIG.JWT.REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, CONFIG.JWT.SECRET as jwt.Secret) as unknown as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new APIError('Access token has expired', 401, 'TOKEN_EXPIRED');
    }
    throw new APIError('Invalid access token', 401, 'INVALID_TOKEN');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, CONFIG.JWT.REFRESH_SECRET as jwt.Secret) as unknown as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new APIError('Refresh token has expired', 401, 'REFRESH_TOKEN_EXPIRED');
    }
    throw new APIError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
};