import { describe, it, expect, afterAll } from "vitest";
import { closeRedis, getRedis, pingRedis } from "@infra/redis/client";

/**
 * Integration: prove Redis round-trip and rate-limit primitive.
 * Requires a running Redis reachable via REDIS_URL.
 */
describe("redis integration", () => {
  afterAll(async () => {
    await closeRedis();
  });

  it("ping returns true", async () => {
    const ok = await pingRedis();
    expect(ok).toBe(true);
  });

  it("round-trips a value", async () => {
    const r = getRedis();
    await r.set("integration:test:key", "value", "EX", 30);
    const got = await r.get("integration:test:key");
    expect(got).toBe("value");
    await r.del("integration:test:key");
  });
});

describe("rate-limit integration", () => {
  afterAll(async () => {
    await closeRedis();
  });

  it("enforces max within a window and resets after", async () => {
    const { rateLimit } = await import("@infra/rate-limit/limiter");
    const key = `it-${Date.now()}`;
    const r1 = await rateLimit({ key, windowSec: 5, max: 2 });
    const r2 = await rateLimit({ key, windowSec: 5, max: 2 });
    const r3 = await rateLimit({ key, windowSec: 5, max: 2 });
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });
});