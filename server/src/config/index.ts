import dotenv from 'dotenv';

dotenv.config();

// Determine if services are running in Docker
const isServicesInDocker = process.env.SERVICES_IN_DOCKER === 'true' || process.env.NODE_ENV === 'docker';
const isDevelopment = process.env.NODE_ENV === 'development';

export const CONFIG = {
  // Server configuration
  PORT: Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Security configuration
  SECURITY: {
    RATE_LIMIT: {
      WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    },
    CORS: {
      ORIGIN: isDevelopment 
        ? ['http://localhost:3000', 'http://localhost:5173']
        : [process.env.CLIENT_URL || 'https://yourdomain.com'],
      CREDENTIALS: true,
    },
    ENABLE_HEADERS: process.env.ENABLE_SECURITY_HEADERS !== 'false',
    ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',
    ENABLE_COMPRESSION: process.env.ENABLE_COMPRESSION !== 'false',
  },

  // Multi-tenant configuration
  TENANT: {
    DEFAULT: process.env.DEFAULT_TENANT || 'default',
    HEADER_NAME: process.env.TENANT_HEADER_NAME || 'X-Tenant-ID',
  },

  // MongoDB configuration
  MONGODB: {
    URI: isServicesInDocker
      ? 'mongodb://mongodb:27017/mernapp'
      : 'mongodb://127.0.0.1:27017/mernapp',
    OPTIONS: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    }
  },

  // PostgreSQL configuration
  POSTGRES: {
    URI: isServicesInDocker
      ? `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@postgres:5432/${process.env.POSTGRES_DB || 'mernapp'}`
      : `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@localhost:5432/${process.env.POSTGRES_DB || 'mernapp'}`,
  },

  // Redis configuration
  REDIS: {
    URI: isServicesInDocker
      ? 'redis://redis:6379'
      : 'redis://localhost:6379',
  },

  // Email configuration (MailHog)
  EMAIL: {
    HOST: isServicesInDocker ? 'mailhog' : 'localhost',
    PORT: Number(process.env.MAILHOG_SMTP_PORT) || 1025,
    FROM: process.env.EMAIL_FROM || 'noreply@example.com',
  },

  // AWS S3 configuration (LocalStack)
  AWS: {
    ENDPOINT: isServicesInDocker
      ? 'http://localstack:4566'
      : 'http://localhost:4566',
    REGION: process.env.AWS_REGION || 'us-east-1',
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'localstack',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'localstack',
  },

  // Debug configuration
  DEBUG: {
    RETRY_ATTEMPTS: isDevelopment ? 5 : 3,
    RETRY_INTERVAL: isDevelopment ? 5000 : 3000, // milliseconds
    SERVICES_IN_DOCKER: isServicesInDocker,
  }
} as const; 