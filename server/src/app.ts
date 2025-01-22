import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.js';
import { CONFIG } from './config/index.js';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug logging middleware
app.use((req: Request, _res: Response, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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
console.log('🚀 Server starting up...');
console.log(`🔧 Environment: ${CONFIG.NODE_ENV}`);
console.log(`📡 MongoDB URI: ${CONFIG.MONGODB.URI}`);
console.log(`🔍 Running in Docker: ${CONFIG.NODE_ENV === 'docker' ? 'Yes' : 'No'}`);
console.log(`🌐 Server will listen on port: ${CONFIG.PORT}`);

// Update database connection
const connectWithRetry = async (retries = CONFIG.DEBUG.RETRY_ATTEMPTS, interval = CONFIG.DEBUG.RETRY_INTERVAL): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(CONFIG.MONGODB.URI, CONFIG.MONGODB.OPTIONS);
      console.log('✅ Connected to MongoDB');
      return true;
    } catch (error) {
      const remaining = retries - i - 1;
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error instanceof Error ? error.message : 'Unknown error');
      if (remaining > 0) {
        console.log(`⏳ Retrying in ${interval/1000}s... (${remaining} attempts remaining)`);
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
        console.log(`🚀 Server running on http://localhost:${CONFIG.PORT}`);
        console.log('📍 Available routes:');
        console.log('   - GET /         -> Basic server check');
        console.log('   - GET /health   -> Health status');
        console.log('   - GET /debug    -> Debug information');
      });
    } else {
      console.error('❌ Failed to connect to MongoDB after multiple retries');
      process.exit(1);
    }
  })
  .catch((error: unknown) => {
    console.error('❌ Fatal error during startup:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  });

export default app;