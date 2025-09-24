import { NextResponse } from 'next/server';

// Scale response types
export interface ScaleResponseData {
  questionId: string;
  responseValue: number; // 1-5
  completionStatus: 'complete' | 'in_progress' | 'not_started';
  timestamp: Date;
  evidenceDocuments?: string[];
  validatedBy?: string;
  validationDate?: Date;
}

export interface ScaleAnalytics {
  averageScore: number;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  scoreDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  improvementAreas: number;
  completedQuestions: number;
  totalQuestions: number;
}

// Standard API Response Interface
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
    pagination?: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

// Success Response Helper
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200,
  pagination?: { total: number; limit: number; offset: number; hasMore: boolean }
): NextResponse {
  const response: APIResponse<T> = {
    success: true,
    data,
    message,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      version: '1.0',
      ...(pagination && { pagination })
    }
  };

  return NextResponse.json(response, { status: statusCode });
}

// Error Response Helper
export function errorResponse(
  error: string,
  statusCode: number = 400,
  details?: any
): NextResponse {
  const response: APIResponse = {
    success: false,
    error,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      version: '1.0'
    }
  };

  if (details) {
    response.data = details;
  }

  return NextResponse.json(response, { status: statusCode });
}

// Validation Error Response
export function validationErrorResponse(
  errors: Record<string, string[]>,
  statusCode: number = 422
): NextResponse {
  return errorResponse('Validation failed', statusCode, { errors });
}

// Authentication Error Response
export function authErrorResponse(
  message: string = 'Authentication required',
  statusCode: number = 401
): NextResponse {
  return errorResponse(message, statusCode);
}

// Authorization Error Response
export function authorizationErrorResponse(
  message: string = 'Insufficient permissions',
  statusCode: number = 403
): NextResponse {
  return errorResponse(message, statusCode);
}

// Not Found Error Response
export function notFoundErrorResponse(
  resource: string = 'Resource',
  statusCode: number = 404
): NextResponse {
  return errorResponse(`${resource} not found`, statusCode);
}

// Rate Limit Error Response
export function rateLimitErrorResponse(
  message: string = 'Rate limit exceeded',
  statusCode: number = 429
): NextResponse {
  return errorResponse(message, statusCode);
}

// Server Error Response
export function serverErrorResponse(
  message: string = 'Internal server error',
  statusCode: number = 500,
  details?: any
): NextResponse {
  return errorResponse(message, statusCode, details);
}

// Generate Request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// API Response Types
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  metadata: {
    timestamp: string;
    requestId: string;
    version: string;
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

// Create Paginated Response
export function paginatedResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number,
  message?: string
): NextResponse {
  const hasMore = offset + data.length < total;
  
  return successResponse(data, message, 200, {
    total,
    limit,
    offset,
    hasMore
  });
}
