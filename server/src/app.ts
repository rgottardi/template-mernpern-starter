import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.js';
import { CONFIG } from './config/index.js';
import { logger, stream } from './config/logger.js';
import { fileURLToPath } from 'url';
import { 
  rateLimiter, 
  securityHeaders, 
  compressionMiddleware, 
  corsMiddleware 
} from './middleware/security.js';
import { responseFormatter } from './middleware/response.js';
import { authenticateToken } from './middleware/auth.js';
import { tenantMiddleware } from './middleware/tenant.js';
import { databaseService } from './services/database.js';
import { postgresService } from './services/postgres.js';
import { redisService } from './services/redis.js';
import { emailService } from './services/email.js';
import { storageService } from './services/storage.js';
import { serviceInitializer } from './services/init.js';

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
    services: {
      mongodb: {
        status: databaseService.getConnectionState() === 1 ? 'connected' : 'disconnected',
        state: databaseService.getConnectionState(),
      },
      postgres: {
        status: postgresService.isConnectedToPostgres() ? 'connected' : 'disconnected',
      },
      redis: {
        status: redisService.isConnectedToRedis() ? 'connected' : 'disconnected',
      },
      email: {
        status: emailService.isEmailServiceInitialized() ? 'initialized' : 'not initialized',
      },
      storage: {
        status: storageService.isStorageServiceInitialized() ? 'initialized' : 'not initialized',
        defaultBucket: storageService.getDefaultBucket(),
      }
    },
    environment: CONFIG.NODE_ENV,
    port: CONFIG.PORT,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
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
    mongooseState: databaseService.getConnectionState(),
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Error handling (should be last)
app.use(errorHandler);

// Initialize services and start server
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const startServer = async () => {
    try {
      // Initialize all services
      const servicesInitialized = await serviceInitializer.initializeServices();
      if (!servicesInitialized) {
        throw new Error('Failed to initialize services');
      }

      // Start Express server
      app.listen(CONFIG.PORT, '0.0.0.0', () => {
        logger.info(`🚀 Server running on http://localhost:${CONFIG.PORT}`);
        logger.info('📍 Available routes:');
        logger.info('   - GET /         -> Basic server check');
        logger.info('   - GET /health   -> Health status');
        logger.info('   - GET /api/debug -> Debug information (protected)');
      });

      // Handle graceful shutdown
      const shutdown = async (signal: string) => {
        logger.info(`📥 Received ${signal}. Starting graceful shutdown...`);
        await serviceInitializer.shutdownServices();
        process.exit(0);
      };

      // Handle different termination signals
      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));
      
      // Handle uncaught errors
      process.on('uncaughtException', (error: Error) => {
        logger.error('❌ Uncaught Exception:', {
          error: error.message,
        });
        shutdown('uncaughtException');
      });
      
      process.on('unhandledRejection', (reason: unknown) => {
        logger.error('❌ Unhandled Rejection:', {
          reason: reason instanceof Error ? reason.message : 'Unknown reason',
        });
        shutdown('unhandledRejection');
      });

    } catch (error) {
      logger.error('❌ Fatal error during startup:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      process.exit(1);
    }
  };

  startServer();
}

export default app;