Based on my research and analysis of popular MERN PERNstarter templates, here's my recommendation for your starter template scope:
I think you should go slightly beyond just user management, but not too far. Here's what I recommend including:

Core Security Infrastructure:


JWT authentication middleware
Role-based access control (RBAC) system
Password hashing and salting (using bcrypt)
Request rate limiting
CORS configuration
Helmet.js for security headers
Input validation middleware (using express-validator or Joi)
XSS protection
Environment variables configuration


User Management:


User registration with email verification
Login/logout functionality
Password reset flow
Basic profile management
Role management (admin/user)
Session management


Basic API Structure:


RESTful API structure
Error handling middleware
Request logging
API documentation setup (using Swagger/OpenAPI)
Basic testing setup (Jest + Supertest)


Development Tools:


ESLint + Prettier configuration
Basic CI/CD pipeline setup
Docker configuration
Development/production environment separation
Hot reloading setup


One Simple Example Feature:


A basic CRUD operation (like a "posts" or "notes" feature)
This serves as a reference for how to structure future features
Demonstrates the security middleware in action
Shows proper error handling patterns

The reasoning behind this scope is:

It provides enough security and infrastructure for real-world use
It demonstrates best practices without being overly opinionated
It's maintainable and easy to understand
It can be extended or modified based on specific needs
It includes common patterns that most MERN applications will need