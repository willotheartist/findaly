// scripts/debug-models.ts
import { prisma } from "../lib/db";

type DebugRow = {
  brand: string | null;
  model: string | null;
  title: string;
};

function uniqRows(rows: DebugRow[]) {
  return Array.from(
    new Set(rows.map((row) => `${row.brand || ""} :: ${row.model || ""} :: ${row.title || ""}`))
  ).slice(0, 60);
}

async function run() {
  const q = (process.argv[2] || "lagoon").toLowerCase();

  const rowsModel = await prisma.listing.findMany({
    where: {
      status: "LIVE",
      kind: "VESSEL",
      intent: "SALE",
      model: { contains: q, mode: "insensitive" },
    },
    select: { brand: true, model: true, title: true },
    take: 80,
  });

  const rowsBrand = await prisma.listing.findMany({
    where: {
      status: "LIVE",
      kind: "VESSEL",
      intent: "SALE",
      brand: { contains: q, mode: "insensitive" },
    },
    select: { brand: true, model: true, title: true },
    take: 80,
  });

  console.log("=== MATCH: model contains ===");
  console.log(uniqRows(rowsModel).join("\n") || "(none)");

  console.log("\n=== MATCH: brand contains ===");
  console.log(uniqRows(rowsBrand).join("\n") || "(none)");
}

run()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });