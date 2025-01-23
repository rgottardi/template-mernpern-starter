import { CONFIG } from './config/index.js';
import { logger } from './config/logger.js';
import { serviceInitializer } from './services/init.js';
import app from './app.js';

/**
 * @desc Server startup manager for handling Express server lifecycle
 */
class ServerManager {
  private static instance: ServerManager;
  private server: any;

  private constructor() {}

  public static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager();
    }
    return ServerManager.instance;
  }

  /**
   * @desc Start the server and initialize all services
   */
  public async start(): Promise<void> {
    try {
      // Initialize all services
      const servicesInitialized = await serviceInitializer.initializeServices();
      if (!servicesInitialized) {
        throw new Error('Failed to initialize services');
      }

      // Start Express server
      this.server = app.listen(CONFIG.PORT, '0.0.0.0', () => {
        logger.info(`🚀 Server running on http://localhost:${CONFIG.PORT}`);
        logger.info('📍 Available routes:');
        logger.info('   - GET /         -> Basic server check');
        logger.info('   - GET /health   -> Health status');
        logger.info('   - GET /api/debug -> Debug information (protected)');
      });

      // Handle graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      logger.error('❌ Fatal error during startup:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      process.exit(1);
    }
  }

  /**
   * @desc Setup graceful shutdown handlers
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`📥 Received ${signal}. Starting graceful shutdown...`);
      
      if (this.server) {
        this.server.close(() => {
          logger.info('✅ HTTP server closed');
        });
      }

      await serviceInitializer.shutdownServices();
      process.exit(0);
    };

    // Handle different termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      shutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason) => {
      logger.error('❌ Unhandled Rejection:', {
        reason: reason instanceof Error ? reason.message : 'Unknown reason',
      });
      shutdown('unhandledRejection');
    });
  }
}

// Create and export server manager instance
export const serverManager = ServerManager.getInstance();

// Start server if this file is run directly
if (require.main === module) {
  serverManager.start();
} 