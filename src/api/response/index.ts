import { NextResponse } from "next/server";

export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T, init?: { status?: number; headers?: HeadersInit; meta?: Record<string, unknown> }) {
  const body: ApiSuccess<T> = { ok: true, data };
  if (init?.meta) body.meta = init.meta;
  return NextResponse.json(body, { status: init?.status ?? 200, headers: init?.headers });
}

export function created<T>(data: T, headers?: HeadersInit) {
  return ok(data, { status: 201, headers });
}

export function noContent(headers?: HeadersInit) {
  return new NextResponse(null, { status: 204, headers });
}

export function fail(opts: {
  code: string;
  message: string;
  status: number;
  requestId: string;
  details?: Record<string, unknown>;
  headers?: HeadersInit;
}) {
  const body: ApiFailure = {
    ok: false,
    error: { code: opts.code, message: opts.message, details: opts.details },
    requestId: opts.requestId,
  };
  return NextResponse.json(body, { status: opts.status, headers: opts.headers });
}