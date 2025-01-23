# MERN/PERN Stack Starter Template

A modern full-stack starter template using MongoDB/PostgreSQL, Express.js, React (Vite), and Node.js.

## Features

- 🚀 Vite for lightning fast development
- 📦 Modern ESM support
- 🎨 Material-UI pre-configured
- 🐳 Docker Compose for local development
- 🔒 TypeScript throughout
- ⭐ React Query for data fetching
- 📝 ESLint + Prettier configured
- 📊 MongoDB & PostgreSQL support
- 📧 MailHog for email testing
- 🔄 Redis for caching
- 🗄️ LocalStack for AWS S3 emulation
- 📱 MongoDB Express & pgAdmin for database management
- 🔍 Redis Commander for cache inspection
- 🛡️ Comprehensive security middleware
- 🏢 Multi-tenant architecture support
- 🔐 JWT authentication and RBAC
- 📡 API rate limiting and compression

## Service Architecture

### Database Services
1. **MongoDB Service**
   - Primary database for document storage
   - Connection pooling and retry logic
   - Health monitoring and graceful shutdown
   - Connection state tracking

2. **PostgreSQL Service**
   - Relational database for structured data
   - Connection pool management
   - Transaction support with automatic rollback
   - Query execution with parameterization
   - Event handling and health monitoring

3. **Redis Service**
   - In-memory caching and session storage
   - Connection retry strategy
   - Pub/sub capabilities
   - Key-value operations with TTL support
   - Health monitoring and event handling

### Storage Service (LocalStack S3)
- File storage with AWS S3 compatibility
- Automatic bucket creation and management
- Pre-signed URL generation for direct upload/download
- File operations (upload, download, delete)
- Bucket listing and object management

### Email Service (MailHog)
- Email sending capabilities
- HTML and text email support
- Attachment handling
- Test email functionality
- Development email catching

### Security & Middleware Features

#### Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Secure token handling and validation
- Refresh token support

#### Multi-tenancy
- Tenant isolation
- Subdomain-based tenant recognition
- Header-based tenant identification
- JWT-based tenant context

#### Security Features
- Helmet security headers
- Rate limiting protection
- CORS configuration
- XSS protection
- CSRF protection
- Content Security Policy
- HTTP Security Headers

#### API Features
- Request validation (Zod)
- Standardized API responses
- Error handling and formatting
- Response compression
- Request logging

#### Middleware Stack
1. Basic Middleware
   - JSON body parsing
   - URL-encoded body parsing

2. Security Middleware
   - Security headers (Helmet)
   - CORS handling
   - Rate limiting
   - Response compression

3. Application Middleware
   - Request logging
   - Response formatting
   - Authentication
   - Multi-tenancy
   - Error handling

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker and Docker Compose

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/rgottardi/template-mernpern-starter.git
cd template-mernpern-starter
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment files:
```bash
npm run env:setup
```

4. Start the development environment:
```bash
npm run dev
```

Your application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MongoDB: localhost:27017
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- MailHog UI: http://localhost:8025
- MongoDB Express: http://localhost:8081
- pgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8082
- LocalStack (S3): http://localhost:4566

### Service Health Checks

You can check the health of all services by visiting:
```
http://localhost:3000/health
```

This will return the status of:
- MongoDB connection
- PostgreSQL connection
- Redis connection
- Email service
- Storage service (LocalStack S3)

### Available Scripts

#### Development
- `npm run dev` - Start all development servers
- `npm run dev:client` - Start client development server
- `npm run dev:server` - Start server development server
- `npm run dev:db` - Start MongoDB container

#### Installation
- `npm run install:all` - Install dependencies for all packages
- `npm run clean:all` - Remove all node_modules directories

#### Building
- `npm run build:all` - Build all packages
- `npm run test:all` - Run all tests
- `npm run lint:all` - Lint all packages

#### Docker Management
- `npm run docker:up` - Start all Docker containers
- `npm run docker:down` - Stop all Docker containers
- `npm run docker:build` - Build all Docker images
- `npm run docker:clean` - Remove all Docker volumes
- `npm run docker:logs` - Show container logs
- `npm run docker:restart` - Restart all containers

#### Environment Management
- `npm run env:setup` - Create environment files from examples
- `npm run env:check` - Validate environment variables
- `npm run env:update` - Update environment files with new variables

## Project Structure

```
template-mernpern-starter/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   ├── theme/        # MUI theme configuration
│   │   └── types/        # TypeScript types
│   └── ...
├── server/                # Express backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Service layer
│   │   └── types/        # TypeScript types
│   └── ...
├── scripts/              # Development scripts
│   ├── setup-env.js     # Environment setup
│   ├── check-env.js     # Environment validation
│   └── update-env.js    # Environment updates
└── docker-compose.yml    # Docker composition
```

## Environment Variables

### Root (.env)
```env
# Environment Configuration
NODE_ENV=development

# Development Ports
CLIENT_PORT=5173
SERVER_PORT=3000
MONGODB_PORT=27017

# Docker Configuration
COMPOSE_PROJECT_NAME=mernpern-starter

# PostgreSQL
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mernapp

# Redis
REDIS_PORT=6379

# MailHog
MAILHOG_SMTP_PORT=1025
MAILHOG_UI_PORT=8025

# LocalStack (AWS S3)
LOCALSTACK_PORT=4566

# MongoDB Express
MONGO_EXPRESS_PORT=8081
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASS=pass

# pgAdmin
PGADMIN_PORT=5050
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin

# Redis Commander
REDIS_COMMANDER_PORT=8082
```

### Client (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_AUTH=true
VITE_SENTRY_DSN=
VITE_GOOGLE_ANALYTICS=
```

### Server (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/mernapp
POSTGRES_URI=postgresql://postgres:postgres@postgres:5432/mernapp
REDIS_URI=redis://redis:6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
CLIENT_URL=https://yourdomain.com  # CORS origin in production
ENABLE_SECURITY_HEADERS=true
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true
DEFAULT_TENANT=default
TENANT_HEADER_NAME=X-Tenant-ID
SMTP_HOST=mailhog
SMTP_PORT=1025
EMAIL_FROM=noreply@example.com
AWS_ENDPOINT=http://localstack:4566
```

## License

MIT