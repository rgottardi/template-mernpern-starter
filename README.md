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

## Getting Started

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
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
│   │   ├── services/     # Business logic
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
NODE_ENV=development
CLIENT_PORT=5173
SERVER_PORT=3000
MONGODB_PORT=27017
COMPOSE_PROJECT_NAME=mernpern-starter
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
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=mailhog
SMTP_PORT=1025
EMAIL_FROM=noreply@example.com
```

## Development

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker and Docker Compose

### Local Development

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment:
```bash
npm run env:setup
npm run env:check  # Validate environment
```

3. Start development servers:
```bash
npm run dev
```

### Using Docker

1. Build and start containers:
```bash
npm run docker:build
npm run docker:up
```

2. View logs:
```bash
npm run docker:logs
```

3. Clean up:
```bash
npm run docker:clean
```

## License

MIT