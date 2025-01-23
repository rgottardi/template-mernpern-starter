import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.js';
import { CONFIG } from './config/index.js';
import { logger, stream } from './config/logger.js';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logging
app.use(morgan('combined', { stream }));

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: CONFIG.NODE_ENV,
    port: CONFIG.PORT
  });
});

// Debug route
app.get('/debug', (_req, res) => {
  res.json({
    environment: CONFIG.NODE_ENV,
    mongoURI: CONFIG.MONGODB.URI,
    port: CONFIG.PORT,
    mongooseState: mongoose.connection.readyState,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Error handling
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