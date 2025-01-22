# Configuration Rules

## 1. Centralized Configuration

All configuration values MUST be managed through the centralized configuration file: `server/src/config/index.ts` for the server and `client/src/config/index.ts` for the client.

## 2. Environment Variables

All environment variables should be:
1. Documented in `.env.example`
2. Validated at startup
3. Have proper TypeScript types
4. Include default values where appropriate

## 3. Configuration Updates

When adding new configuration values:
1. Add to `config/index.ts`
2. Update `.env.example`
3. Update documentation if needed
4. Consider adding validation

## 4. Debugging and Logging

- Use `console.log` for debugging messages
- Add comments to explain why certain values are set as they are
- Ensure all logs are relevant to the current state of the application

## 5. Documentation

- Update the README with any new configuration values
- Add comments to the codebase to explain how configuration values are used

## 6. Validation

- Add validation to the configuration file to ensure that the correct types are used
- Consider using a library like `zod` or `joi` for validation

