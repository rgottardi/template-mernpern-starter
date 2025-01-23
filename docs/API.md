# API Documentation

## Authentication

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### POST /api/auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

## Users

### GET /api/users/me
Get current user profile.

**Headers:**
```
Authorization: Bearer jwt.token.here
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

### PUT /api/users/me
Update current user profile.

**Headers:**
```
Authorization: Bearer jwt.token.here
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "details": {
    "field": ["error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "UnauthorizedError",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "ForbiddenError",
  "message": "Insufficient permissions"
}
```

### 500 Internal Server Error
```json
{
  "error": "InternalServerError",
  "message": "Something went wrong"
}
```