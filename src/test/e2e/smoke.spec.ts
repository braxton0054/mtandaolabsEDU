import { test, expect } from "@playwright/test";

test.describe("Phase 1 smoke", () => {
  test("home loads and shows the foundation heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /foundation/i, level: 1 })).toBeVisible();
    await expect(page.getByText("Phase 1 · Foundation")).toBeVisible();
  });

  test("health endpoint reports application status", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBeLessThan(600);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toHaveProperty("status");
    expect(body.data.checks.application.status).toBe("up");
  });

  test("versioned endpoint works", async ({ request }) => {
    const res = await request.get("/api/v1/hello");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.greeting).toMatch(/Hello from mtandaolabsEDU/);
  });

  test("Zod validation rejects malformed bodies with 422", async ({ request }) => {
    const res = await request.post("/api/v1/hello", { data: { message: "" } });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("404 page renders on unknown routes", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /Page not found/ })).toBeVisible();
  });

  test("mobile viewport still works", async ({ page, viewport }) => {
    test.skip(!viewport || viewport.width >= 768, "only mobile viewport");
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});