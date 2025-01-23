# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- MongoDB or PostgreSQL
- Git

### Installation
1. Clone repository
```bash
git clone https://github.com/rgottardi/template-mernpern-starter.git
cd template-mernpern-starter
```

2. Install dependencies
```bash
npm install
```

3. Set up environment
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start development servers
```bash
# With Docker
docker-compose up -d

# Without Docker
npm run dev
```

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   
├── server/                # Express backend
│   ├── config/           # Configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
│
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

## Development Workflow

### Code Style
- ESLint enforces code style
- Prettier formats code
- Use ESM imports
- Follow component naming conventions

### Git Workflow
1. Create feature branch
```bash
git checkout -b feature/your-feature
```

2. Make changes and commit
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push and create PR
```bash
git push origin feature/your-feature
```

### Testing
```bash
# Run all tests
npm test

# Run specific tests
npm test -- users.test.js

# Coverage report
npm run test:coverage
```

## Database

### MongoDB
```javascript
// Example model
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
```

### PostgreSQL
```javascript
// Example model
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default User;
```

## Adding New Features

### Frontend Component
```jsx
// Example component
import React from 'react';

const ExampleComponent = ({ data }) => {
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </div>
  );
};

export default ExampleComponent;
```

### Backend Route
```javascript
// Example route
import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/example', auth, async (req, res) => {
  try {
    // Route logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## Deployment

### Build
```bash
# Build frontend
npm run build:client

# Build backend
npm run build:server
```

### Production Start
```bash
npm run start:prod
```

## Troubleshooting

### Common Issues
1. Port conflicts
   - Check if ports 3000/5000 are in use
   - Update .env port settings

2. Database connection
   - Verify connection string
   - Check database service is running

3. Authentication issues
   - Validate JWT secret
   - Check token expiration
   - Confirm cookie settings

### Debug Tools
- React DevTools
- MongoDB Compass
- pgAdmin (PostgreSQL)
- Postman/Insomnia

## Resources
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)