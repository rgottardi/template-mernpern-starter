import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 3000;

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
    environment: process.env.NODE_ENV,
    port: port
  });
});

// Debug route
app.get('/debug', (_req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    mongoURI: process.env.NODE_ENV === 'docker' ? 'mongodb://mongodb:27017/mernapp' : 'mongodb://127.0.0.1:27017/mernapp',
    port: port,
    mongooseState: mongoose.connection.readyState,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Error handling
app.use(errorHandler);

// Determine MongoDB URI based on environment
const mongoURI: string = process.env.NODE_ENV === 'docker' 
  ? process.env.MONGODB_URI_DOCKER ?? 'mongodb://mongodb:27017/mernapp'
  : process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/mernapp';

// Add debug logging
console.log('🚀 Server starting up...');
console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
console.log(`📡 MongoDB URI: ${mongoURI}`);
console.log(`🔍 Running in Docker: ${process.env.NODE_ENV === 'docker' ? 'Yes' : 'No'}`);
console.log(`🌐 Server will listen on port: ${port}`);

// Database connection with retry logic
const connectWithRetry = async (retries = 5, interval = 5000): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });
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

// Start server only after successful database connection
connectWithRetry()
  .then(success => {
    if (success) {
      app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
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