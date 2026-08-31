/**
 * Centralized application error hierarchy.
 *
 * Throw these from anywhere; the central error middleware in
 *     src/api/errors/handler.ts
 * converts them to safe, consistent JSON responses with appropriate status codes.
 *
 * Stack traces are NEVER exposed to clients in non-development environments.
 */

export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "PAYLOAD_TOO_LARGE"
  | "INTERNAL"
  | "NOT_IMPLEMENTED"
  | "DEPENDENCY_UNAVAILABLE";

const STATUS: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL: 500,
  NOT_IMPLEMENTED: 501,
  DEPENDENCY_UNAVAILABLE: 503,
};

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details: Record<string, unknown> | undefined;
  public readonly expose: boolean;

  constructor(opts: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    expose?: boolean;
    cause?: unknown;
  }) {
    super(opts.message);
    this.name = this.constructor.name;
    this.code = opts.code;
    this.status = STATUS[opts.code];
    this.details = opts.details;
    this.expose = opts.expose ?? true;
    if (opts.cause !== undefined) {
      (this as { cause?: unknown }).cause = opts.cause;
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: Record<string, unknown>) {
    super({ code: "BAD_REQUEST", message, details });
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: Record<string, unknown>) {
    super({ code: "VALIDATION_ERROR", message, details });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super({ code: "UNAUTHORIZED", message });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super({ code: "FORBIDDEN", message });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super({ code: "NOT_FOUND", message });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: Record<string, unknown>) {
    super({ code: "CONFLICT", message, details });
  }
}

export class RateLimitedError extends AppError {
  constructor(message = "Too many requests", details?: Record<string, unknown>) {
    super({ code: "RATE_LIMITED", message, details });
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message = "Payload too large") {
    super({ code: "PAYLOAD_TOO_LARGE", message });
  }
}

export class NotImplementedError extends AppError {
  constructor(message = "Not implemented") {
    super({ code: "NOT_IMPLEMENTED", message });
  }
}

export class DependencyUnavailableError extends AppError {
  constructor(message = "Dependency unavailable", details?: Record<string, unknown>) {
    super({ code: "DEPENDENCY_UNAVAILABLE", message, details });
  }
}

export class InternalError extends AppError {
  constructor(message = "Internal server error", cause?: unknown) {
    super({ code: "INTERNAL", message, expose: false, cause });
  }
}