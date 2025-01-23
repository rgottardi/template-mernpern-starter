import { Request, Response, NextFunction } from 'express';
import { APIError } from './error.js';

interface TenantRequest extends Request {
  user?: {
    tenantId?: string;
  };
}

/**
 * @desc Middleware to extract and validate tenant information
 * Supports multiple tenant identification methods:
 * 1. From subdomain (tenant.domain.com)
 * 2. From header (X-Tenant-ID)
 * 3. From JWT token (already added to req.user by auth middleware)
 */
export const tenantMiddleware = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let tenantId: string | undefined;

    // Try to get tenant from subdomain
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      tenantId = subdomain;
    }

    // Try to get tenant from header
    const headerTenantId = req.header('X-Tenant-ID');
    if (headerTenantId) {
      tenantId = headerTenantId;
    }

    // Try to get tenant from authenticated user
    if (req.user?.tenantId) {
      tenantId = req.user.tenantId;
    }

    if (!tenantId) {
      throw new APIError('Tenant ID is required', 400, 'TENANT_ID_REQUIRED');
    }

    // Add tenant ID to request for use in subsequent middleware/routes
    req.tenantId = tenantId;
    
    // Add tenant to response headers for debugging/tracking
    res.setHeader('X-Tenant-ID', tenantId);
    
    next();
  } catch (error) {
    next(error);
  }
};

export default tenantMiddleware;

// Extend Express Request type to include tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
} 