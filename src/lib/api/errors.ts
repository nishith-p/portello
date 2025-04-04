import { NextResponse } from 'next/server';

// Base API error class
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication error (401)
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// Authorization error (403)
export class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
  }
}

// Not found error (404)
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// Bad request error (400)
export class BadRequestError extends ApiError {
  constructor(message = 'Invalid request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

// Validation error (422)
export class ValidationError extends ApiError {
  public readonly fields: Record<string, string>;

  constructor(message = 'Validation failed', fields: Record<string, string> = {}) {
    super(message, 422, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

// Database error (500)
export class DatabaseError extends ApiError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

/**
 * Create a standardized error response
 */
export function errorResponse(error: Error): NextResponse {
  console.error('API Error:', error);

  // Determine status code and error code
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let fields: Record<string, string> | undefined;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;

    if (error instanceof ValidationError) {
      fields = error.fields;
    }
  } else if (error.name === 'PostgrestError') {
    statusCode = 500;
    code = 'DATABASE_ERROR';
    message = error.message;
  }

  const errorObj: any = {
    error: {
      message,
      code
    }
  };

  if (fields) {
    errorObj.error.fields = fields;
  }

  return NextResponse.json(errorObj, { status: statusCode });
}