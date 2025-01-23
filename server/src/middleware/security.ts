import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { CONFIG } from '../config/index.js';
import type { Request, Response, NextFunction } from 'express';

/**
 * @desc Rate limiting middleware configuration
 */
export const rateLimiter = CONFIG.SECURITY.ENABLE_RATE_LIMITING ? rateLimit({
  windowMs: CONFIG.SECURITY.RATE_LIMIT.WINDOW_MS,
  max: CONFIG.SECURITY.RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
}) : (_req: Request, _res: Response, next: NextFunction) => next();

/**
 * @desc Compression middleware configuration
 */
export const compressionMiddleware = CONFIG.SECURITY.ENABLE_COMPRESSION ? compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Default compression level
}) : (_req: Request, _res: Response, next: NextFunction) => next();

/**
 * @desc CORS middleware configuration
 */
export const corsMiddleware = cors({
  origin: CONFIG.SECURITY.CORS.ORIGIN,
  credentials: CONFIG.SECURITY.CORS.CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', CONFIG.TENANT.HEADER_NAME],
});

/**
 * @desc Security headers middleware using helmet
 */
export const securityHeaders = CONFIG.SECURITY.ENABLE_HEADERS ? helmet({
  contentSecurityPolicy: CONFIG.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: CONFIG.NODE_ENV === 'production',
  crossOriginOpenerPolicy: CONFIG.NODE_ENV === 'production',
  crossOriginResourcePolicy: CONFIG.NODE_ENV === 'production',
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: CONFIG.NODE_ENV === 'production',
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: true,
  xssFilter: true,
}) : (_req: Request, _res: Response, next: NextFunction) => next(); 