import { PrismaClient } from "@prisma/client";
import { env, isDevelopment, isProduction, isTest } from "@config/index";
import { logger } from "@infra/logging/logger";

let client: PrismaClient | null = null;

function buildClient(): PrismaClient {
  return new PrismaClient({
    log: isDevelopment
      ? [{ level: "query", emit: "event" }, { level: "error", emit: "event" }, { level: "warn", emit: "event" }]
      : [{ level: "error", emit: "event" }],
    datasources: { db: { url: env.DATABASE_URL } },
    errorFormat: isProduction ? "minimal" : "pretty",
  });
}

export function getPrisma(): PrismaClient {
  if (client) return client;
  client = buildClient();
  if (isDevelopment) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client as any).$on("query", (e: { query: string; duration: number }) => {
      logger.debug({ query: e.query, durationMs: e.duration }, "prisma query");
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (client as any).$on("error", (e: { message: string }) => {
    logger.error({ err: e.message }, "prisma error");
  });
  return client;
}

/** Verify a SELECT 1 round trip. */
export async function pingDatabase(): Promise<boolean> {
  if (isTest) return true;
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "database ping failed");
    return false;
  }
}

export async function closePrisma(): Promise<void> {
  if (!client) return;
  await client.$disconnect();
  client = null;
}

export { PrismaClient };