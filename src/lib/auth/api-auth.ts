import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface APIUser {
  id: string;
  email: string;
  organizationId: string;
  role: string;
  permissions: string[];
}

export interface APIToken {
  userId: string;
  organizationId: string;
  role: string;
  permissions: string[];
  exp: number;
  iat: number;
}

// API Authentication Middleware
export async function authenticateAPI(request: NextRequest): Promise<APIUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, secret) as APIToken;
    
    return {
      id: decoded.userId,
      email: '', // Would be fetched from DB
      organizationId: decoded.organizationId,
      role: decoded.role,
      permissions: decoded.permissions
    };
  } catch (error) {
    console.error('API Authentication Error:', error);
    return null;
  }
}

// API Authorization Helper
export function hasPermission(user: APIUser, requiredPermission: string): boolean {
  return user.permissions.includes(requiredPermission) || user.role === 'admin';
}

// API Key Authentication (Alternative)
export async function authenticateAPIKey(request: NextRequest): Promise<APIUser | null> {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return null;
    }

    // Validate API key against database
    // This would typically query your database for valid API keys
    // For now, using environment variable
    const validKeys = process.env.API_KEYS?.split(',') || [];
    
    if (!validKeys.includes(apiKey)) {
      return null;
    }

    // Return a service user for API key authentication
    return {
      id: 'api-service',
      email: 'api@complianceiq.com',
      organizationId: 'default-org',
      role: 'api-service',
      permissions: ['read', 'write', 'admin']
    };
  } catch (error) {
    console.error('API Key Authentication Error:', error);
    return null;
  }
}

// Generate API Token
export function generateAPIToken(user: APIUser): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  const payload: APIToken = {
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
    permissions: user.permissions,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, secret);
}

// Rate Limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = identifier;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}
