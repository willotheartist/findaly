// scripts/fix-services-kind.ts
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

async function main() {
  const serviceSignals: Prisma.ListingWhereInput[] = [
    { serviceCategory: { not: null } },
    { serviceName: { not: null } },
    { serviceDescription: { not: null } },
    { serviceExperience: { not: null } },
  ];

  const whereWrongKind: Prisma.ListingWhereInput = {
    kind: "VESSEL",
    OR: serviceSignals, // ✅ mutable array
  };

  const wrongKind = await prisma.listing.findMany({
    where: whereWrongKind,
    select: { id: true, slug: true, title: true, kind: true },
    take: 5000,
  });

  if (!wrongKind.length) {
    console.log("[OK] No service listings found with kind=VESSEL.");
    return;
  }

  console.log(`[INFO] Found ${wrongKind.length} service listings marked as VESSEL. Fixing...`);

  const res = await prisma.listing.updateMany({
    where: whereWrongKind,
    data: { kind: "SERVICES" },
  });

  console.log(`[OK] Updated ${res.count} listings: kind VESSEL -> SERVICES`);
  console.log("[SAMPLE]", wrongKind.slice(0, 10));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });