import dotenv from 'dotenv';

dotenv.config();

// Determine if services are running in Docker
const isServicesInDocker = process.env.SERVICES_IN_DOCKER === 'true' || process.env.NODE_ENV === 'docker';
const isDevelopment = process.env.NODE_ENV === 'development';

export const CONFIG = {
  // Server configuration
  PORT: Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
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