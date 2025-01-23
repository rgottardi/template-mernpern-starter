import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.js';
import { CONFIG } from './config/index.js';
import { logger, stream } from './config/logger.js';
import { 
  rateLimiter, 
  securityHeaders, 
  compressionMiddleware, 
  corsMiddleware 
} from './middleware/security.js';
import { responseFormatter } from './middleware/response.js';
import { authenticateToken } from './middleware/auth.js';
import { tenantMiddleware } from './middleware/tenant.js';

dotenv.config();

const app: Express = express();

// Basic middleware (should be first)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(securityHeaders); // Helmet security headers
app.use(corsMiddleware); // CORS configuration
app.use(rateLimiter); // Rate limiting
app.use(compressionMiddleware); // Response compression

// Logging middleware
app.use(morgan('combined', { stream }));

// Response formatting middleware
app.use(responseFormatter);

// Public routes (no auth required)
app.get('/', (_req, res) => {
  res.success({ message: 'Server is running!' });
});

app.get('/health', (_req, res) => {
  res.success({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: CONFIG.NODE_ENV,
    port: CONFIG.PORT
  });
});

// Protected routes middleware
app.use('/api', [
  authenticateToken, // JWT authentication
  tenantMiddleware, // Multi-tenant handling
]);

// Protected routes
app.get('/api/debug', (_req, res) => {
  res.success({
    environment: CONFIG.NODE_ENV,
    mongoURI: CONFIG.MONGODB.URI,
    port: CONFIG.PORT,
    mongooseState: mongoose.connection.readyState,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Error handling (should be last)
app.use(errorHandler);

// Update logging
logger.info('🚀 Server starting up...');
logger.info(`🔧 Environment: ${CONFIG.NODE_ENV}`);
logger.info(`📡 MongoDB URI: ${CONFIG.MONGODB.URI}`);
logger.info(`🔍 Running in Docker: ${CONFIG.NODE_ENV === 'docker' ? 'Yes' : 'No'}`);
logger.info(`🌐 Server will listen on port: ${CONFIG.PORT}`);

// Update database connection
const connectWithRetry = async (retries = CONFIG.DEBUG.RETRY_ATTEMPTS, interval = CONFIG.DEBUG.RETRY_INTERVAL): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(CONFIG.MONGODB.URI, CONFIG.MONGODB.OPTIONS);
      logger.info('✅ Connected to MongoDB');
      return true;
    } catch (error) {
      const remaining = retries - i - 1;
      logger.error('❌ MongoDB connection attempt failed:', {
        attempt: i + 1,
        error: error instanceof Error ? error.message : 'Unknown error',
        remaining,
      });
      if (remaining > 0) {
        logger.info(`⏳ Retrying in ${interval/1000}s... (${remaining} attempts remaining)`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }
  return false;
};

// Start server
connectWithRetry()
  .then(success => {
    if (success) {
      app.listen(CONFIG.PORT, '0.0.0.0', () => {
        logger.info(`🚀 Server running on http://localhost:${CONFIG.PORT}`);
        logger.info('📍 Available routes:');
        logger.info('   - GET /         -> Basic server check');
        logger.info('   - GET /health   -> Health status');
        logger.info('   - GET /debug    -> Debug information');
      });
    } else {
      logger.error('❌ Failed to connect to MongoDB after multiple retries');
      process.exit(1);
    }
  })
  .catch((error: unknown) => {
    logger.error('❌ Fatal error during startup:', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  });

export default app;