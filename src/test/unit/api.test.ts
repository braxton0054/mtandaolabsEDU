import { describe, it, expect } from "vitest";
import { z } from "zod";
import { parseOrThrow } from "@api/validation/parse";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
  RateLimitedError,
  ConflictError,
} from "@api/errors/types";
import type { AppError } from "@api/errors/types";

const Schema = z.object({ name: z.string().min(2), age: z.number().int().min(0) });

describe("parseOrThrow", () => {
  it("returns parsed data on valid input", () => {
    const r = parseOrThrow(Schema, { name: "Ada", age: 36 });
    expect(r).toEqual({ name: "Ada", age: 36 });
  });

  it("throws ValidationError on invalid input", () => {
    try {
      parseOrThrow(Schema, { name: "A", age: -1 });
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as AppError).status).toBe(422);
    }
  });
});

describe("error types", () => {
  it("maps AppError subclasses to correct HTTP statuses", () => {
    expect(new BadRequestError().status).toBe(400);
    expect(new NotFoundError().status).toBe(404);
    expect(new ValidationError().status).toBe(422);
    expect(new RateLimitedError().status).toBe(429);
    expect(new ConflictError().status).toBe(409);
  });
});