// scripts/fix/normalise-brands.ts
//
// Normalises brand and model fields in the listing table.
// Many listings have model names stored in the brand field
// (e.g. "Bali 5 4" instead of brand="Bali" model="5.4").
//
// Run: npx tsx scripts/fix/normalise-brands.ts
// Add --dry-run to preview without writing.

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL in environment. Add it to .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const DRY_RUN = process.argv.includes("--dry-run");

// ─────────────────────────────────────────────────────────────
// Known brand mappings
// Key: what we might see in the brand field (lowercased)
// Value: { brand, model? } — what it should be
// ─────────────────────────────────────────────────────────────

type BrandMap = { brand: string; model?: string };

const BRAND_FIXES: Record<string, BrandMap> = {
  // Bali variants
  "bali 5 4": { brand: "Bali", model: "5.4" },
  "bali 4 4": { brand: "Bali", model: "4.4" },
  "bali 4 6": { brand: "Bali", model: "4.6" },
  "bali 4 8": { brand: "Bali", model: "4.8" },
  "bali 4 3": { brand: "Bali", model: "4.3" },
  "bali 4 1": { brand: "Bali", model: "4.1" },
  "bali 4": { brand: "Bali", model: "4" },
  "bali 5": { brand: "Bali", model: "5" },
  "bali catsmart": { brand: "Bali", model: "Catsmart" },
  "bali catspace": { brand: "Bali", model: "Catspace" },

  // Lagoon variants
  "lagoon 42": { brand: "Lagoon", model: "42" },
  "lagoon 40": { brand: "Lagoon", model: "40" },
  "lagoon 380 s2": { brand: "Lagoon", model: "380 S2" },
  "lagoon 400 s2": { brand: "Lagoon", model: "400 S2" },
  "lagoon 450": { brand: "Lagoon", model: "450" },
  "lagoon 46": { brand: "Lagoon", model: "46" },
  "lagoon 50": { brand: "Lagoon", model: "50" },

  // Dufour variants
  "dufour 520 gl": { brand: "Dufour", model: "520 GL" },
  "dufour 460 gl": { brand: "Dufour", model: "460 GL" },
  "dufour 412 gl": { brand: "Dufour", model: "412 GL" },
  "dufour 390 gl": { brand: "Dufour", model: "390 GL" },

  // Sunreef variants
  "sunreef 60": { brand: "Sunreef", model: "60" },
  "sunreef 50": { brand: "Sunreef", model: "50" },
  "sunreef 60 pow": { brand: "Sunreef", model: "60 Power" },
  "sunreef 80": { brand: "Sunreef", model: "80" },

  // Elan variants
  "elan impression 434": { brand: "Elan", model: "Impression 434" },
  "elan e4": { brand: "Elan", model: "E4" },

  // Fountaine Pajot
  "fountaine pajot tanna": { brand: "Fountaine Pajot", model: "Tanna" },
  "fountaine pajot": { brand: "Fountaine Pajot" },

  // Hanse
  "hanse 470e": { brand: "Hanse", model: "470e" },

  // Nautitech
  "nautitech 46 fly": { brand: "Nautitech", model: "46 Fly" },

  // Dynamique
  "dynamique 58": { brand: "Dynamique", model: "58" },

  // Manda
  "manda s07": { brand: "Manda", model: "S07" },

  // Junk entries
  "m y": { brand: "Unknown", model: undefined },
  "other": { brand: "Other", model: undefined },
};

// ─────────────────────────────────────────────────────────────
// Auto-detect pattern: if brand contains a known root brand
// followed by numbers/letters, split it
// ─────────────────────────────────────────────────────────────

const KNOWN_BRANDS = [
  "Bali",
  "Lagoon",
  "Dufour",
  "Sunreef",
  "Elan",
  "Fountaine Pajot",
  "Hanse",
  "Bavaria",
  "Beneteau",
  "Jeanneau",
  "Azimut",
  "Princess",
  "Galeon",
  "Hallberg Rassy",
  "Nautitech",
  "Dynamique",
  "Excess",
  "Riva",
  "Sanlorenzo",
  "Sunseeker",
  "Manda",
];

function tryAutoSplit(raw: string): BrandMap | null {
  const lower = raw.toLowerCase().trim();

  for (const knownBrand of KNOWN_BRANDS) {
    const prefix = knownBrand.toLowerCase();
    if (lower === prefix) return null; // exact match, no split needed
    if (lower.startsWith(prefix + " ")) {
      const rest = raw.slice(knownBrand.length).trim();
      if (rest.length > 0) {
        return { brand: knownBrand, model: rest };
      }
    }
  }
  return null;
}

async function main() {
  console.log(`\n🔧 Brand normalisation ${DRY_RUN ? "(DRY RUN)" : "(LIVE)"}\n`);

  const listings = await prisma.listing.findMany({
    where: { brand: { not: null } },
    select: { id: true, brand: true, model: true },
  });

  console.log(`Found ${listings.length} listings with brand set.\n`);

  let fixed = 0;
  let skipped = 0;

  for (const listing of listings) {
    const raw = (listing.brand || "").trim();
    if (!raw) continue;

    const lower = raw.toLowerCase();

    // Check explicit mapping first
    let fix: BrandMap | null = BRAND_FIXES[lower] || null;

    // Try auto-split if no explicit mapping
    if (!fix) {
      fix = tryAutoSplit(raw);
    }

    if (!fix) {
      skipped++;
      continue;
    }

    const newBrand = fix.brand;
    const newModel = fix.model ?? listing.model ?? null;

    // Skip if nothing changed
    if (newBrand === listing.brand && newModel === listing.model) {
      skipped++;
      continue;
    }

    console.log(
      `  ${listing.id}: "${listing.brand}" / "${listing.model}" → "${newBrand}" / "${newModel}"`
    );

    if (!DRY_RUN) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: {
          brand: newBrand,
          ...(fix.model ? { model: newModel } : {}),
        },
      });
    }

    fixed++;
  }

  console.log(`\n✅ Done. Fixed: ${fixed}, Skipped: ${skipped}`);
  if (DRY_RUN) {
    console.log(`\n   Run without --dry-run to apply changes.`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});