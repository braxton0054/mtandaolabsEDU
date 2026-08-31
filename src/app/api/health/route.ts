import { NextResponse, type NextRequest } from "next/server";
import { ok } from "@api/response";
import { withRequest } from "@api/middleware/request";
import { handleError } from "@api/errors/handler";
import { pingDatabase } from "@db/client";
import { pingRedis } from "@infra/redis/client";
import { env } from "@config/index";
import type { CheckResult, HealthReport } from "@shared/types/health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function timed<T>(fn: () => Promise<T>): Promise<{ result?: T; durationMs: number; error?: Error }> {
  const start = Date.now();
  try {
    const result = await fn();
    return { result, durationMs: Date.now() - start };
  } catch (err) {
    return { durationMs: Date.now() - start, error: err as Error };
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  return withRequest(req, async () => {
    try {
      const checks: Record<string, CheckResult> = {};
      checks.application = { status: "up" };

      const db = await timed(() => pingDatabase());
      checks.database = db.error
        ? { status: "down", latencyMs: db.durationMs, error: db.error.message }
        : { status: "up", latencyMs: db.durationMs };

      const rd = await timed(() => pingRedis());
      checks.redis = rd.error
        ? { status: "down", latencyMs: rd.durationMs, error: rd.error.message }
        : { status: "up", latencyMs: rd.durationMs };

      const anyDown = Object.values(checks).some((c) => c.status === "down");
      const status: HealthReport["status"] = anyDown ? "down" : "ok";

      const report: HealthReport = {
        status,
        timestamp: new Date().toISOString(),
        version: env.APP_VERSION,
        environment: env.NODE_ENV,
        uptimeSec: Math.round(process.uptime()),
        checks,
      };

      return ok(report, { status: status === "down" ? 503 : 200 });
    } catch (err) {
      return handleError(err);
    }
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}