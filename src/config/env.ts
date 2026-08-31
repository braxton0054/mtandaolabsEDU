import { z } from "zod";

const nodeEnv = z.enum(["development", "test", "staging", "production"]).default("development");

const numericString = (defaultValue: number) =>
  z
    .preprocess((v) => {
      if (v === undefined || v === null || v === "") return defaultValue;
      const n = typeof v === "string" ? Number(v) : (v as number);
      return Number.isFinite(n) ? n : defaultValue;
    }, z.number().int().nonnegative())
    .pipe(z.number());

const booleanString = z
  .preprocess((v) => {
    if (typeof v === "boolean") return v;
    if (typeof v !== "string") return false;
    return ["1", "true", "yes", "on"].includes(v.toLowerCase());
  }, z.boolean());

const schema = z.object({
  NODE_ENV: nodeEnv,
  APP_NAME: z.string().default("mtandaolabsEDU"),
  APP_VERSION: z.string().default("0.1.0"),
  APP_URL: z.string().url(),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  LOG_PRETTY: booleanString.default(false),

  API_PREFIX: z.string().default("/api"),
  API_VERSION: z.string().default("v1"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_DIRECT_URL: z.string().min(1).optional(),
  DATABASE_POOL_MAX: numericString(10),
  DATABASE_POOL_MIN: numericString(0),
  DATABASE_STATEMENT_TIMEOUT_MS: numericString(10_000),

  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  REDIS_KEY_PREFIX: z.string().default("mtandaolabsedu"),

  RATE_LIMIT_DEFAULT_WINDOW_SEC: numericString(60),
  RATE_LIMIT_DEFAULT_MAX: numericString(120),

  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  TRUSTED_ORIGINS: z
    .string()
    .default("")
    .transform((s) =>
      s
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
    ),

  STORAGE_DRIVER: z.enum(["local"]).default("local"),
  STORAGE_LOCAL_ROOT: z.string().default("./storage"),

  BACKUP_DRIVER: z.enum(["local", "b2"]).default("local"),
  BACKUP_B2_KEY_ID: z.string().optional(),
  BACKUP_B2_APPLICATION_KEY: z.string().optional(),
  BACKUP_B2_BUCKET: z.string().optional(),
  BACKUP_B2_ENDPOINT: z.string().optional(),

  OTEL_ENABLED: booleanString.default(false),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

/**
 * Validate and cache the process environment.
 * Throws a safe, structured error at startup if required values are missing —
 * never partially boots with missing secrets.
 */
export function loadEnv(source: Record<string, unknown> = process.env): Env {
  if (cached) return cached;

  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(
      `Invalid environment configuration. Fix the following before starting:\n${issues}`,
    );
  }
  cached = parsed.data;
  return cached;
}

/** Test-only: reset cache (used by env-validation unit tests). */
export function __resetEnvForTests(): void {
  cached = null;
}

export const envSchema = schema;