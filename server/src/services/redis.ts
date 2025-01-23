import { Redis } from 'ioredis';
import { CONFIG } from '../config/index.js';
import { logger } from '../config/logger.js';

/**
 * @desc Redis service for managing Redis connection and cache operations
 */
class RedisService {
  private static instance: RedisService;
  private client: Redis | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  /**
   * @desc Initialize Redis connection
   */
  public async connect(): Promise<boolean> {
    try {
      this.client = new Redis(CONFIG.REDIS.URI, {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
      });

      await this.waitForConnection();
      this.setupEventHandlers();
      
      logger.info('✅ Connected to Redis');
      this.isConnected = true;
      return true;
    } catch (error) {
      logger.error('❌ Redis connection failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * @desc Wait for Redis connection to be ready
   */
  private async waitForConnection(): Promise<void> {
    if (!this.client) throw new Error('Redis client not initialized');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis connection timeout'));
      }, 10000);

      this.client!.once('ready', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.client!.once('error', (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * @desc Setup Redis event handlers
   */
  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('error', (error: Error) => {
      logger.error('❌ Redis error:', {
        error: error.message,
      });
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('🔄 Redis reconnecting...');
    });

    this.client.on('ready', () => {
      logger.info('✅ Redis connection ready');
      this.isConnected = true;
    });
  }

  /**
   * @desc Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      logger.info('📤 Disconnected from Redis');
    }
  }

  /**
   * @desc Get Redis client instance
   */
  public getClient(): Redis | null {
    return this.client;
  }

  /**
   * @desc Check if Redis is connected
   */
  public isConnectedToRedis(): boolean {
    return this.isConnected;
  }

  /**
   * @desc Set a key-value pair with optional expiration
   */
  public async set(key: string, value: string, expireSeconds?: number): Promise<boolean> {
    try {
      if (!this.client) throw new Error('Redis client not initialized');
      
      if (expireSeconds) {
        await this.client.setex(key, expireSeconds, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error('❌ Redis set operation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        key,
      });
      return false;
    }
  }

  /**
   * @desc Get value by key
   */
  public async get(key: string): Promise<string | null> {
    try {
      if (!this.client) throw new Error('Redis client not initialized');
      return await this.client.get(key);
    } catch (error) {
      logger.error('❌ Redis get operation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        key,
      });
      return null;
    }
  }

  /**
   * @desc Delete key
   */
  public async del(key: string): Promise<boolean> {
    try {
      if (!this.client) throw new Error('Redis client not initialized');
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('❌ Redis delete operation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        key,
      });
      return false;
    }
  }
}

export const redisService = RedisService.getInstance(); 