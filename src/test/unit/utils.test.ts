import { describe, it, expect } from "vitest";
import { cn, formatDuration, safeJson } from "@lib/utils";

describe("cn", () => {
  it("merges class names, dropping falsy", () => {
    expect(cn("a", false, "b", undefined, "c")).toBe("a b c");
  });
  it("last-wins on tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatDuration", () => {
  it("formats sub-second values in ms", () => {
    expect(formatDuration(123)).toBe("123ms");
  });
  it("formats >=1s values in seconds", () => {
    expect(formatDuration(1500)).toBe("1.50s");
  });
});

describe("safeJson", () => {
  it("returns fallback for null/undefined", () => {
    expect(safeJson(null, { a: 1 })).toEqual({ a: 1 });
    expect(safeJson(undefined, [])).toEqual([]);
  });
});