import type { z } from "zod";
import { ValidationError } from "@api/errors/types";

/**
 * Parse a payload against a Zod schema; throw a ValidationError (HTTP 422)
 * with the structured issues attached. Use everywhere a request body / query
 * / params enters the system.
 */
export function parseOrThrow<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Request validation failed", {
      issues: result.error.issues.map((i) => ({
        path: i.path.join("."),
        code: i.code,
        message: i.message,
      })),
    });
  }
  return result.data;
}