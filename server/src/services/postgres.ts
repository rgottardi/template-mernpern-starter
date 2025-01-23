import pkg from 'pg';
const { Pool } = pkg;
import { CONFIG } from '../config/index.js';
import { logger } from '../config/logger.js';

/**
 * @desc PostgreSQL service for managing database connections and operations
 */
class PostgresService {
  private static instance: PostgresService;
  private pool: pkg.Pool | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): PostgresService {
    if (!PostgresService.instance) {
      PostgresService.instance = new PostgresService();
    }
    return PostgresService.instance;
  }

  /**
   * @desc Initialize PostgreSQL connection pool
   */
  public async connect(): Promise<boolean> {
    try {
      this.pool = new Pool({
        connectionString: CONFIG.POSTGRES.URI,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test the connection
      const client = await this.pool.connect();
      client.release();
      
      this.setupEventHandlers();
      this.isConnected = true;
      logger.info('✅ Connected to PostgreSQL');
      return true;
    } catch (error) {
      logger.error('❌ PostgreSQL connection failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * @desc Setup pool event handlers
   */
  private setupEventHandlers(): void {
    if (!this.pool) return;

    this.pool.on('error', (error: Error) => {
      logger.error('❌ Unexpected PostgreSQL error:', {
        error: error.message,
      });
      this.isConnected = false;
    });

    this.pool.on('connect', () => {
      logger.debug('🔌 New PostgreSQL client connected');
    });

    this.pool.on('remove', () => {
      logger.debug('🔌 PostgreSQL client removed from pool');
    });
  }

  /**
   * @desc Disconnect from PostgreSQL
   */
  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
      logger.info('📤 Disconnected from PostgreSQL');
    }
  }

  /**
   * @desc Get a client from the connection pool
   */
  public async getClient(): Promise<pkg.PoolClient | null> {
    try {
      if (!this.pool) throw new Error('PostgreSQL pool not initialized');
      return await this.pool.connect();
    } catch (error) {
      logger.error('❌ Failed to get PostgreSQL client:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * @desc Execute a query with parameters
   */
  public async query<T>(text: string, params?: any[]): Promise<T[] | null> {
    const client = await this.getClient();
    if (!client) return null;

    try {
      const result = await client.query(text, params);
      return result.rows as T[];
    } catch (error) {
      logger.error('❌ PostgreSQL query failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query: text,
      });
      return null;
    } finally {
      client.release();
    }
  }

  /**
   * @desc Execute a transaction with multiple queries
   */
  public async transaction<T>(callback: (client: pkg.PoolClient) => Promise<T>): Promise<T | null> {
    const client = await this.getClient();
    if (!client) return null;

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('❌ PostgreSQL transaction failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    } finally {
      client.release();
    }
  }

  /**
   * @desc Check if PostgreSQL is connected
   */
  public isConnectedToPostgres(): boolean {
    return this.isConnected;
  }
}

export const postgresService = PostgresService.getInstance(); 