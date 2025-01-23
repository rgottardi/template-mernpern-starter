import { Router } from 'express';
import { databaseService } from '../services/database.js';
import { postgresService } from '../services/postgres.js';
import { redisService } from '../services/redis.js';
import { emailService } from '../services/email.js';
import { storageService } from '../services/storage.js';
import { CONFIG } from '../config/index.js';

const router = Router();

router.get('/', (_req, res) => {
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

export default router; 