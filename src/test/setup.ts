/**
 * Vitest setup — runs before each test file.
 *
 * Pre-populates process.env with valid values so modules that call
 * `loadEnv()` at import time (env, prisma client factory) succeed.
 * Tests can override individual values via vi.stubEnv() or process.env
 * assignments as needed.
 */

const env = process.env as Record<string, string | undefined>;

env.NODE_ENV ??= "test";
env.APP_URL ??= "http://localhost:3000";
env.APP_VERSION ??= "0.1.0-test";
env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
env.DATABASE_DIRECT_URL ??= env.DATABASE_URL;
env.REDIS_URL ??= "redis://localhost:6379";
env.AUTH_SECRET ??= "test-secret-not-used-anywhere-else-32chars";
env.LOG_LEVEL ??= "warn";
env.STORAGE_DRIVER ??= "local";
env.STORAGE_LOCAL_ROOT ??= "/tmp/mlabs-test-storage";
env.BACKUP_DRIVER ??= "local";
env.TRUSTED_ORIGINS ??= "";