import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRequestLogger } from "@infra/logging/logger";

export const REQUEST_ID_HEADER = "x-request-id";

export function getOrAssignRequestId(req: NextRequest): { requestId: string; headerValue: string } {
  const incoming = req.headers.get(REQUEST_ID_HEADER);
  const sanitized = incoming?.match(/^[A-Za-z0-9._-]{1,128}$/)?.[0];
  const requestId = sanitized ?? randomUUID();
  return { requestId, headerValue: sanitized ?? requestId };
}

/** Apply the request id to a response (idempotent). */
export function withRequestIdHeader(res: NextResponse | Response, requestId: string): NextResponse {
  if (res instanceof NextResponse) {
    res.headers.set(REQUEST_ID_HEADER, requestId);
    return res;
  }
  const next = new NextResponse(res.body, { status: res.status, statusText: res.statusText, headers: res.headers });
  next.headers.set(REQUEST_ID_HEADER, requestId);
  return next;
}

/** Async-local storage of the current request id. Lets `handleError` read it. */
interface RequestCtx {
  requestId: string;
}
const als = new AsyncLocalStorage<RequestCtx>();

export function getCurrentRequestId(): string | undefined {
  return als.getStore()?.requestId;
}

/**
 * Run a handler with a request-scoped logger + request id echo on the response.
 * The request id is stored in AsyncLocalStorage so error handlers downstream can
 * read it.
 */
export async function withRequest(
  req: NextRequest,
  fn: (requestId: string, log: ReturnType<typeof createRequestLogger>) => Promise<Response | NextResponse> | Response | NextResponse,
): Promise<Response | NextResponse> {
  const { requestId } = getOrAssignRequestId(req);
  const log = createRequestLogger(requestId);
  const start = Date.now();
  try {
    log.info({ method: req.method, url: req.nextUrl.pathname }, "request received");
    const result = await als.run({ requestId }, () => fn(requestId, log));
    const stamped = withRequestIdHeader(result as NextResponse, requestId);
    log.info({ durationMs: Date.now() - start }, "request completed");
    return stamped;
  } catch (err) {
    log.error({ err: (err as Error).message, durationMs: Date.now() - start }, "request failed");
    throw err;
  }
}