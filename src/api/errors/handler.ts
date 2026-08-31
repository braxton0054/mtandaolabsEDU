import type { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError, InternalError } from "./types";
import { fail } from "../response";
import { createRequestLogger } from "@infra/logging/logger";
import { isDevelopment } from "@config/index";
import { getCurrentRequestId } from "@api/middleware/request";

/**
 * Convert any thrown value into a safe NextResponse.
 *
 * - AppError → expose its message/details with the mapped status.
 * - ZodError → 422 ValidationError.
 * - Prisma known errors → mapped to safe codes (no SQL leakage).
 * - Anything else → 500 with a generic message in non-dev; full message in dev.
 */
export function handleError(err: unknown, requestId?: string): NextResponse {
  const id = requestId ?? getCurrentRequestId() ?? "unknown";
  const log = createRequestLogger(id);

  if (err instanceof AppError) {
    if (err.status >= 500) log.error({ err: err.message, code: err.code }, "request failed");
    else log.warn({ err: err.message, code: err.code }, "request rejected");
    return fail({
      code: err.code,
      message: err.message,
      status: err.status,
      requestId: id,
      details: err.details,
    });
  }

  if (err instanceof ZodError) {
    log.warn({ issues: err.issues }, "zod validation failed");
    return fail({
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      status: 422,
      requestId: id,
      details: { issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    log.error({ code: err.code, meta: err.meta }, "prisma known error");
    if (err.code === "P2002") {
      return fail({
        code: "CONFLICT",
        message: "Resource already exists",
        status: 409,
        requestId: id,
        details: { target: (err.meta as { target?: unknown })?.target },
      });
    }
    if (err.code === "P2025") {
      return fail({ code: "NOT_FOUND", message: "Resource not found", status: 404, requestId: id });
    }
    return fail({ code: "INTERNAL", message: "Database error", status: 500, requestId: id });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    log.error({ err: err.message }, "prisma init failed");
    return fail({ code: "DEPENDENCY_UNAVAILABLE", message: "Database unavailable", status: 503, requestId: id });
  }

  const wrapped = new InternalError("Unhandled error", err);
  log.error({ err: (err as Error)?.message ?? String(err), stack: (err as Error)?.stack }, "unhandled error");
  return fail({
    code: wrapped.code,
    message: isDevelopment ? ((err as Error)?.message ?? "Unhandled error") : wrapped.message,
    status: wrapped.status,
    requestId: id,
  });
}