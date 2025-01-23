import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';
import { APIError } from './error.js';

type ValidationError = {
  path: string;
  message: string;
};

/**
 * @desc Middleware to validate request data against a Zod schema
 * @param schema The Zod schema to validate against
 */
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.issues.map((err: ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        next(new APIError(
          'Validation failed',
          400,
          'VALIDATION_ERROR',
          validationErrors
        ));
      } else {
        next(error);
      }
    }
  };
}; 