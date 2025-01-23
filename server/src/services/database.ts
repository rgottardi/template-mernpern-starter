import mongoose from 'mongoose';
import { CONFIG } from '../config/index.js';
import { logger } from '../config/logger.js';

/**
 * @desc Database service for managing MongoDB connections and operations
 */
class DatabaseService {
  private static instance: DatabaseService;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * @desc Attempts to connect to MongoDB with retry logic
   * @param retries Number of retry attempts
   * @param interval Interval between retries in milliseconds
   */
  public async connect(
    retries = CONFIG.DEBUG.RETRY_ATTEMPTS,
    interval = CONFIG.DEBUG.RETRY_INTERVAL
  ): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      try {
        await mongoose.connect(CONFIG.MONGODB.URI, CONFIG.MONGODB.OPTIONS);
        this.isConnected = true;
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
  }

  /**
   * @desc Disconnects from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('📤 Disconnected from MongoDB');
    }
  }

  /**
   * @desc Returns the current connection state
   */
  public getConnectionState(): number {
    return mongoose.connection.readyState;
  }

  /**
   * @desc Returns whether the database is connected
   */
  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}

export const databaseService = DatabaseService.getInstance(); 