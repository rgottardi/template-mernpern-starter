# Development Guide

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker and Docker Compose

### Initial Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Set up environment files:
   ```bash
   npm run env:setup
   ```
4. Verify environment configuration:
   ```bash
   npm run env:check
   ```

## Development Scripts

### Core Development
- `npm run dev` - Start all development services (client, server, MongoDB)
- `npm run dev:client` - Start client development server only
- `npm run dev:server` - Start backend development server only
- `npm run dev:db` - Start MongoDB only
- `npm run dev:tools` - Start development tools (Mailhog, Mongo Express, Redis)

### Docker Management
- `npm run docker:up` - Start Docker development environment
- `npm run docker:down` - Stop Docker environment
- `npm run docker:build` - Build Docker images
- `npm run docker:clean` - Clean Docker environment (remove containers, volumes)
- `npm run docker:logs` - View Docker logs
- `npm run docker:restart` - Restart Docker services
- `npm run docker:prune` - Remove unused Docker resources
- `npm run docker:rebuild` - Full rebuild of Docker environment

### Environment Management
- `npm run env:setup` - Set up environment files from examples
- `npm run env:check` - Verify environment configuration
- `npm run check:deps` - Check for dependency version mismatches

### Utility Scripts
- `npm run reset` - Reset development environment
- `npm run install:all` - Install all dependencies
- `npm run build:all` - Build all packages
- `npm run test:all` - Run all tests
- `npm run lint:all` - Run linting
- `npm run clean:all` - Remove all node_modules

## Development Tools

The template includes several development tools accessible via `npm run dev:tools`:

### Mailhog
- Web UI: http://localhost:8025
- SMTP Port: 1025
- Usage: Development email testing

### Mongo Express
- Web UI: http://localhost:8081
- Default credentials: admin/pass
- Usage: MongoDB management interface

### Redis
- Port: 6379
- Usage: Caching and session storage

## Development Workflow

1. Start the development environment:
   ```bash
   npm run dev
   ```

2. (Optional) Start development tools:
   ```bash
   npm run dev:tools
   ```

3. Access services:
   - Client: http://localhost:5173
   - Server: http://localhost:3000
   - MongoDB: localhost:27017
   - Mailhog: http://localhost:8025
   - Mongo Express: http://localhost:8081
   - Redis: localhost:6379

## Troubleshooting

### Reset Development Environment
```bash
npm run reset
```
This will:
1. Clean node_modules
2. Clean Docker environment
3. Reinstall dependencies
4. Reset environment files

### Check Dependencies
```bash
npm run check:deps
```
Identifies version mismatches across packages

### Docker Issues
```bash
npm run docker:rebuild
```
Performs a clean rebuild of the Docker environment