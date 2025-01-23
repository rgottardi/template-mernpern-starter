import { Router } from 'express';
import healthRoutes from './health.routes.js';
import debugRoutes from './debug.routes.js';

const router = Router();

// Public routes
router.use('/health', healthRoutes);

// Protected routes (these will be protected by middleware in app.ts)
router.use('/debug', debugRoutes);

export default router; 