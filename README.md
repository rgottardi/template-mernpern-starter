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

### Using This Template

1. Click the "Use this template" button at the top of this repository
   - Alternatively, you can create a new repository and clone this one as a starting point

2. Clone your new repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

3. Set up environment files:
```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

4. Start the development environment:
```bash
docker-compose up --build
```

Your application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MongoDB: localhost:27017

### Development Without Docker

If you prefer to develop without Docker:

1. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

2. Start the development servers:

```bash
# Start the client (in the client directory)
npm run dev

# Start the server (in the server directory)
npm run dev
```

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
└── docker-compose.yml    # Docker composition
```

## Available Scripts

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Root

- `npm run dev` - Start all development servers concurrently
- `npm run dev:client` - Start client development server
- `npm run dev:server` - Start server development server
- `npm run dev:db` - Start MongoDB using Docker
- `npm run install:all` - Install dependencies for root, client, and server
- `npm run build:all` - Build client and server
- `npm run test:all` - Run tests for client and server concurrently
- `npm run lint:all` - Run ESLint for client and server concurrently
- `npm run clean:all` - Clean all node_modules directories
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run docker:build` - Build Docker containers
- `npm run docker:clean` - Remove Docker containers and volumes
- `npm run docker:logs` - View Docker logs
- `npm run docker:restart` - Restart Docker containers
- `npm run env:setup` - Set up environment files
- `npm run env:check` - Check environment files
- `npm run env:update` - Update environment files

## Environment Variables

### Client (.env)

```env
VITE_API_URL=http://localhost:3000
```

### Server (.env)

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/mernapp
JWT_SECRET=your_jwt_secret
```

### Root (.env)

```env
# Add any root-level environment variables here
```

## Development Workflow

1. Set up environment files:
```bash
npm run env:setup
```

2. Start the development environment:
```bash
npm run dev
```

3. To check environment files:
```bash
npm run env:check
```

4. To update environment files:
```bash
npm run env:update
```

## Docker Management

1. Start Docker containers:
```bash
npm run docker:up
```

2. Stop Docker containers:
```bash
npm run docker:down
```

3. Build Docker containers:
```bash
npm run docker:build
```

4. Remove Docker containers and volumes:
```bash
npm run docker:clean
```

5. View Docker logs:
```bash
npm run docker:logs
```

6. Restart Docker containers:
```bash
npm run docker:restart
```

## Adding New Features

### Frontend

1. Components: Add new components in `client/src/components`
2. Pages: Add new pages in `client/src/pages`
3. API Services: Add new services in `client/src/services`
4. Types: Add new types in `client/src/types`

### Backend

1. Routes: Add new routes in `server/src/routes`
2. Controllers: Add new controllers in `server/src/controllers`
3. Models: Add new models in `server/src/models`
4. Middleware: Add new middleware in `server/src/middleware`

## Deployment

### Manual Deployment

1. Build the client:
```bash
cd client
npm run build
```

2. Build the server:
```bash
cd server
npm run build
```

3. Start the production server:
```bash
npm start
```

### Docker Deployment

A production Docker Compose file is included for deployment:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

MIT
