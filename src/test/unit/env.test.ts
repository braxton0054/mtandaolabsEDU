import { describe, it, expect } from "vitest";
import { loadEnv, __resetEnvForTests } from "@config/env";

const base = {
  NODE_ENV: "test",
  APP_URL: "http://localhost:3000",
  DATABASE_URL: "postgresql://x:y@localhost:5432/test",
  REDIS_URL: "redis://localhost:6379",
  AUTH_SECRET: "a-very-long-secret-that-is-actually-ok",
  TRUSTED_ORIGINS: "http://localhost:3000,https://staging.example.com",
  STORAGE_DRIVER: "local",
  BACKUP_DRIVER: "local",
};

describe("env loader", () => {
  it("loads a valid environment with derived values", () => {
    __resetEnvForTests();
    const env = loadEnv({ ...base, NODE_ENV: "production", LOG_PRETTY: "false" });
    expect(env.NODE_ENV).toBe("production");
    expect(env.TRUSTED_ORIGINS).toEqual(["http://localhost:3000", "https://staging.example.com"]);
    expect(env.DATABASE_POOL_MAX).toBe(10);
  });

  it("rejects when DATABASE_URL is missing", () => {
    __resetEnvForTests();
    const { DATABASE_URL: _drop, ...rest } = base;
    expect(() => loadEnv(rest as Record<string, unknown>)).toThrow(/DATABASE_URL/);
  });

  it("rejects when AUTH_SECRET is too short", () => {
    __resetEnvForTests();
    expect(() => loadEnv({ ...base, AUTH_SECRET: "short" })).toThrow(/AUTH_SECRET/);
  });

  it("defaults LOG_PRETTY to false", () => {
    __resetEnvForTests();
    const env = loadEnv(base);
    expect(env.LOG_PRETTY).toBe(false);
  });

  it("coerces boolean-like strings", () => {
    __resetEnvForTests();
    expect(loadEnv({ ...base, LOG_PRETTY: "true" }).LOG_PRETTY).toBe(true);
    __resetEnvForTests();
    expect(loadEnv({ ...base, LOG_PRETTY: "0" }).LOG_PRETTY).toBe(false);
    __resetEnvForTests();
    expect(loadEnv({ ...base, LOG_PRETTY: "yes" }).LOG_PRETTY).toBe(true);
    __resetEnvForTests();
    expect(loadEnv({ ...base, LOG_PRETTY: "false" }).LOG_PRETTY).toBe(false);
  });
});