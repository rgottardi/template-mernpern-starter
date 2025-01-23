# Configuration Rules

## 1. Centralized Configuration

All configuration values MUST be managed through the centralized configuration files:
- Server: `server/src/config/index.ts`
- Client: `client/src/config/index.ts`

## 2. Environment Variables

All environment variables should be:
1. Documented in `.env.example`
2. Validated at startup using TypeScript type checking and runtime validation
3. Have proper TypeScript types defined in the configuration file
4. Include default values where appropriate
5. Be accessed only through the centralized configuration object

## 3. Configuration Updates

When adding new configuration values:
1. Add to appropriate `config/index.ts`
2. Update `.env.example` with the new variable and description
3. Update documentation in README.md
4. Add TypeScript types and validation
5. Include appropriate default values

## 4. Configuration Structure

### Server Configuration
The server configuration should follow this pattern:
```typescript
export const CONFIG = {
  // Server configuration
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Service-specific configuration
  SERVICE_NAME: {
    PROPERTY: process.env.SERVICE_PROPERTY || 'default',
    OPTIONS: {
      // Service-specific options
    }
  }
} as const;
```

### Environment-Aware Configuration
Configuration should handle different environments:
```typescript
MONGODB: {
  URI: process.env.NODE_ENV === 'docker' 
    ? 'mongodb://mongodb:27017/app'
    : 'mongodb://127.0.0.1:27017/app',
  OPTIONS: {
    // Connection options
  }
}
```

## 5. Type Safety

- Use TypeScript's `as const` assertion for configuration objects
- Define explicit types for configuration sections:
```typescript
type DatabaseConfig = {
  URI: string;
  OPTIONS: {
    timeout: number;
    retries: number;
  };
};
```

## 6. Error Handling

- Use TypeScript's type system to catch configuration errors at compile time
- Add runtime checks for critical configuration values
- Provide helpful error messages that indicate:
  1. Which configuration value is missing or invalid
  2. What the expected format/type is
  3. What the actual value was (except for sensitive data)

## 7. Security Considerations

- Never log sensitive configuration values (passwords, API keys, etc.)
- Use appropriate environment variables for different environments
- Store sensitive values in secure environment management systems in production
- Use separate .env files for different environments (.env.development, .env.production, etc.)
- Always provide secure defaults for non-sensitive values

## 8. Documentation

- Keep README.md updated with all available configuration options
- Document the purpose and format of each configuration value
- Include examples of valid values
- Document any dependencies between configuration values
- Maintain TypeScript documentation using JSDoc comments

## 9. Best Practices

1. Group related configuration values into namespaces
2. Use UPPERCASE for configuration constants
3. Provide clear default values for optional configuration
4. Include TypeScript type definitions for all configuration objects
5. Use environment-specific logic within the configuration file
6. Keep configuration values immutable using `as const`

