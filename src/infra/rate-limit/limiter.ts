import type { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@infra/redis/client";
import { env } from "@config/index";
import { RateLimitedError } from "@api/errors/types";

export interface RateLimitOptions {
  key: string;
  windowSec: number;
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSec: number;
}

/**
 * Fixed-window counter implemented with INCR + EXPIRE.
 *
 * Phase 1 deliberately uses a single, well-known primitive:
 * atomic INCR + first-time EXPIRE → safe, predictable, race-free at Redis.
 *
 * Future phases may upgrade to a sliding window or token bucket without
 * changing the public API.
 */
export async function rateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const r = getRedis();
  const fullKey = `ratelimit:${opts.key}`;
  const count = await r.incr(fullKey);
  if (count === 1) {
    await r.expire(fullKey, opts.windowSec);
  }
  const ttl = await r.ttl(fullKey);
  const resetSec = ttl > 0 ? ttl : opts.windowSec;
  const remaining = Math.max(0, opts.max - count);
  return { allowed: count <= opts.max, remaining, resetSec };
}

/** Convenience: default policy from env. */
export function defaultPolicy(): { windowSec: number; max: number } {
  return { windowSec: env.RATE_LIMIT_DEFAULT_WINDOW_SEC, max: env.RATE_LIMIT_DEFAULT_MAX };
}

/**
 * Drop-in middleware that returns a 429 NextResponse if the request is limited,
 * or null to continue. Apply in route handlers before business logic.
 */
export async function enforceRateLimit(req: NextRequest, opts?: Partial<RateLimitOptions>): Promise<NextResponse | null> {
  const policy = { ...defaultPolicy(), ...opts };
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  const path = req.nextUrl.pathname;
  const result = await rateLimit({ key: `ip:${ip}:${path}`, ...policy });
  if (!result.allowed) {
    throw new RateLimitedError("Too many requests", { retryAfter: result.resetSec });
  }
  return null;
}