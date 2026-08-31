import { loadEnv } from "./env";

let resolved: ReturnType<typeof loadEnv> | null = null;

function resolve(): ReturnType<typeof loadEnv> {
  if (resolved) return resolved;
  try {
    resolved = loadEnv();
  } catch (err) {
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NEXT_PHASE === "phase-development-build") {
      // During Next.js build-time page-data collection we don't need real env.
      // The runtime phase will re-load and fail loudly if env is invalid.
      // Return a permissive placeholder so static analysis + compilation succeed.
      // The runtime server (and the /api/health route specifically) validates env on first request.
      return new Proxy({} as ReturnType<typeof loadEnv>, {
        get() { return undefined; },
        has() { return true; },
        ownKeys() { return []; },
        getOwnPropertyDescriptor() { return undefined; },
      }) as ReturnType<typeof loadEnv>;
    }
    throw err;
  }
  return resolved;
}

/**
 * Lazy proxy for the validated env object. Defer validation to first access so
 * that build-time module instantiation doesn't crash when env isn't present.
 */
export const env = new Proxy({} as ReturnType<typeof loadEnv>, {
  get(_t, prop: string) {
    return (resolve() as unknown as Record<string, unknown>)[prop];
  },
  has(_t, prop: string) {
    return prop in (resolve() as object);
  },
  ownKeys() {
    return Object.keys(resolve());
  },
  getOwnPropertyDescriptor(_t, prop: string) {
    return Object.getOwnPropertyDescriptor(resolve(), prop);
  },
});

export const isProduction = (env.NODE_ENV as string) === "production";
export const isStaging = (env.NODE_ENV as string) === "staging";
export const isDevelopment = (env.NODE_ENV as string) === "development";
export const isTest = (env.NODE_ENV as string) === "test";