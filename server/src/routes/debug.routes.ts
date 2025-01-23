import { Router } from 'express';
import { CONFIG } from '../config/index.js';
import { databaseService } from '../services/database.js';

const router = Router();

router.get('/', (_req, res) => {
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

export default router; 