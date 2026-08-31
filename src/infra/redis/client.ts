import Redis, { type RedisOptions } from "ioredis";
import { env, isTest } from "@config/index";
import { logger } from "@infra/logging/logger";

export type RedisLike = Pick<Redis, "get" | "set" | "del" | "incr" | "expire" | "ttl" | "keys" | "exists" | "ping" | "quit" | "eval">;

const options: RedisOptions = {
  keyPrefix: `${env.REDIS_KEY_PREFIX}:`,
  lazyConnect: true,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  reconnectOnError: (err) => {
    logger.warn({ err: err.message }, "redis reconnect on error");
    return true;
  },
};

let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;
  client = new Redis(env.REDIS_URL, options);
  client.on("error", (err) => logger.error({ err: err.message }, "redis error"));
  client.on("connect", () => logger.info("redis connecting"));
  client.on("ready", () => logger.info("redis ready"));
  return client;
}

/** Ping Redis; returns true if reachable. Used by /api/health. */
export async function pingRedis(): Promise<boolean> {
  if (isTest) return true;
  try {
    const r = getRedis();
    const res = await r.ping();
    return res === "PONG";
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "redis ping failed");
    return false;
  }
}

/** Disconnect — used in tests / graceful shutdown. */
export async function closeRedis(): Promise<void> {
  if (!client) return;
  await client.quit();
  client = null;
}

export { Redis };