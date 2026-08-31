import { describe, it, expect } from "vitest";
import { resolveTenant, NO_TENANT } from "@shared/tenant";

describe("tenant", () => {
  it("resolves to NO_TENANT in phase 1", () => {
    expect(resolveTenant(new Request("http://localhost"))).toEqual(NO_TENANT);
  });
});