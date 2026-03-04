import { prisma } from "../lib/db";

async function run() {
  const q = (process.argv[2] || "lagoon").toLowerCase();

  const rowsModel = await prisma.listing.findMany({
    where: { status: "LIVE", kind: "VESSEL", intent: "SALE", model: { contains: q, mode: "insensitive" } },
    select: { brand: true, model: true, title: true },
    take: 80,
  });

  const rowsBrand = await prisma.listing.findMany({
    where: { status: "LIVE", kind: "VESSEL", intent: "SALE", brand: { contains: q, mode: "insensitive" } },
    select: { brand: true, model: true, title: true },
    take: 80,
  });

  const uniq = (rows: any[]) =>
    Array.from(new Set(rows.map((r) => `${r.brand || ""} :: ${r.model || ""} :: ${r.title || ""}`))).slice(0, 60);

  console.log("=== MATCH: model contains ===");
  console.log(uniq(rowsModel).join("\n") || "(none)");

  console.log("\n=== MATCH: brand contains ===");
  console.log(uniq(rowsBrand).join("\n") || "(none)");
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
