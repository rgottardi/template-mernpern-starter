import { logger } from '../config/logger.js';
import { CONFIG } from '../config/index.js';
import { databaseService } from './database.js';
import { redisService } from './redis.js';
import { postgresService } from './postgres.js';
import { emailService } from './email.js';
import { storageService } from './storage.js';

/**
 * @desc Service initialization manager for handling startup of all services
 */
class ServiceInitializer {
  private static instance: ServiceInitializer;

  private constructor() {}

  public static getInstance(): ServiceInitializer {
    if (!ServiceInitializer.instance) {
      ServiceInitializer.instance = new ServiceInitializer();
    }
    return ServiceInitializer.instance;
  }

  /**
   * @desc Initialize all required services
   */
  public async initializeServices(): Promise<boolean> {
    try {
      logger.info('🚀 Initializing services...');
      logger.info(`🔧 Environment: ${CONFIG.NODE_ENV}`);
      logger.info(`🔍 Running in Docker: ${CONFIG.DEBUG.SERVICES_IN_DOCKER ? 'Yes' : 'No'}`);

      // Initialize MongoDB
      const mongoConnected = await databaseService.connect();
      if (!mongoConnected) {
        throw new Error('Failed to connect to MongoDB');
      }

      // Initialize PostgreSQL
      const postgresConnected = await postgresService.connect();
      if (!postgresConnected) {
        throw new Error('Failed to connect to PostgreSQL');
      }

      // Initialize Redis
      const redisConnected = await redisService.connect();
      if (!redisConnected) {
        throw new Error('Failed to connect to Redis');
      }

      // Initialize Email Service
      const emailInitialized = await emailService.initialize();
      if (!emailInitialized) {
        throw new Error('Failed to initialize Email service');
      }

      // Initialize Storage Service (LocalStack S3)
      const storageInitialized = await storageService.initialize();
      if (!storageInitialized) {
        throw new Error('Failed to initialize Storage service');
      }
      
      logger.info('✅ All services initialized successfully');
      return true;
    } catch (error) {
      logger.error('❌ Service initialization failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * @desc Gracefully shutdown all services
   */
  public async shutdownServices(): Promise<void> {
    try {
      logger.info('🛑 Shutting down services...');
      
      // Disconnect MongoDB
      await databaseService.disconnect();
      
      // Disconnect PostgreSQL
      await postgresService.disconnect();
      
      // Disconnect Redis
      await redisService.disconnect();
      
      // Close Email Service
      await emailService.close();

      logger.info('✅ All services shut down successfully');
    } catch (error) {
      logger.error('❌ Error during service shutdown:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const serviceInitializer = ServiceInitializer.getInstance(); 