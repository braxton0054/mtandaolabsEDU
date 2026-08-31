import pino, { type Logger, type LoggerOptions } from "pino";
import { env, isDevelopment } from "@config/index";

const sensitiveFields = [
  "password",
  "pass",
  "token",
  "accessToken",
  "refreshToken",
  "secret",
  "authorization",
  "cookie",
  "otp",
  "apiKey",
  "api_key",
  "creditCard",
  "ssn",
  "nationalId",
  "national_id",
  "mpesaCode",
  "payheroSecret",
  "b2ApplicationKey",
];

const redactPaths = sensitiveFields.flatMap((field) => [
  `*.${field}`,
  `*.headers.${field}`,
  `*.body.${field}`,
  `*.query.${field}`,
  `*.params.${field}`,
  `req.headers.${field}`,
  `res.headers.${field}`,
]);

function buildOptions(): LoggerOptions {
  const baseOptions: LoggerOptions = {
    name: (env.APP_NAME as string) ?? "mtandaolabsEDU",
    level: (env.LOG_LEVEL as pino.LevelWithSilent) ?? "info",
    base: {
      service: (env.APP_NAME as string) ?? "mtandaolabsEDU",
      env: (env.NODE_ENV as string) ?? "development",
      version: (env.APP_VERSION as string) ?? "0.0.0",
    },
    redact: { paths: redactPaths, censor: "[REDACTED]" },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { severity: label.toUpperCase() };
      },
    },
  };
  return isDevelopment && (env.LOG_PRETTY as boolean)
    ? { ...baseOptions, transport: { target: "pino-pretty", options: { colorize: true } } }
    : baseOptions;
}

let cached: Logger | null = null;
function get(): Logger {
  if (cached) return cached;
  cached = pino(buildOptions());
  return cached;
}

/**
 * Logger proxy — defers real Pino construction to first call so that
 * `import { logger } from "@infra/logging/logger"` is safe during
 * Next.js build-time page-data collection.
 */
export const logger: Logger = new Proxy({} as Logger, {
  get(_t, prop: string | symbol) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (get() as any)[prop];
  },
}) as Logger;

export type RequestLogger = Logger & { requestId: string };

/** Build a child logger bound to a request id. */
export function createRequestLogger(requestId: string): RequestLogger {
  const child = get().child({ requestId }) as Logger;
  Object.defineProperty(child, "requestId", { value: requestId, enumerable: false });
  return child as RequestLogger;
}