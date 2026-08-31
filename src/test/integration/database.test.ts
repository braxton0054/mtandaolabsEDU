import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

/**
 * Integration: prove Postgres + Prisma migrations round-trip.
 * Requires a running Postgres reachable via DATABASE_URL.
 *
 * Run with: pnpm test:integration
 */
const prisma = new PrismaClient();

describe("database integration", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("SELECT 1 round-trips", async () => {
    const rows = await prisma.$queryRaw<Array<{ "?column?": number }>>`SELECT 1`;
    expect(rows.length).toBe(1);
  });

  it("can write and read HealthCheck rows", async () => {
    const created = await prisma.healthCheck.create({ data: { label: "integration-test" } });
    expect(created.id).toBeTruthy();
    const found = await prisma.healthCheck.findUnique({ where: { id: created.id } });
    expect(found?.label).toBe("integration-test");
    await prisma.healthCheck.delete({ where: { id: created.id } });
  });
});