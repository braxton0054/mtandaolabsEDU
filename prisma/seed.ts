import { PrismaClient } from "@prisma/client";

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.healthCheck.count();
    if (existing > 0) {
      console.log(`Seed skipped: ${existing} health_checks already present.`);
      return;
    }
    const created = await prisma.healthCheck.create({
      data: { label: "phase-1-seed" },
    });
    console.log(`Seed complete: created health_check ${created.id}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});