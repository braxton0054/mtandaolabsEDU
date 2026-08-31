import type { NextRequest } from "next/server";
import { ok, created } from "@api/response";
import { withRequest } from "@api/middleware/request";
import { handleError } from "@api/errors/handler";
import { parseOrThrow } from "@api/validation/parse";
import { z } from "zod";
import { enforceRateLimit } from "@infra/rate-limit/limiter";
import { NotFoundError } from "@api/errors/types";

export const runtime = "nodejs";

const EchoSchema = z.object({
  message: z.string().min(1).max(500),
});

export async function GET(req: NextRequest) {
  return withRequest(req, async () => {
    try {
      const rateLimited = await enforceRateLimit(req);
      if (rateLimited) return rateLimited;
      return ok({ greeting: "Hello from mtandaolabsEDU", phase: 1 });
    } catch (err) {
      return handleError(err);
    }
  });
}

export async function POST(req: NextRequest) {
  return withRequest(req, async () => {
    try {
      const rateLimited = await enforceRateLimit(req);
      if (rateLimited) return rateLimited;

      let body: unknown;
      try {
        body = await req.json();
      } catch {
        body = {};
      }
      const data = parseOrThrow(EchoSchema, body);
      return created({ echo: data.message });
    } catch (err) {
      return handleError(err);
    }
  });
}

export async function PUT(req: NextRequest) {
  return withRequest(req, async () => {
    try {
      throw new NotFoundError("PUT /api/v1/hello is not implemented");
    } catch (err) {
      return handleError(err);
    }
  });
}