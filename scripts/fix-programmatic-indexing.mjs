import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const targets = [
  "app/buy/brand/[brand]/page.tsx",
  "app/buy/model/[model]/page.tsx",
  "app/buy/country/[country]/page.tsx",
  "app/buy/year/[year]/page.tsx",
  "app/buy/brand/[brand]/country/[country]/page.tsx",
  "app/buy/brand/[brand]/model/[model]/page.tsx",
  "app/buy/brand/[brand]/year/[year]/page.tsx",
  "app/buy/model/[model]/country/[country]/page.tsx",
  "app/buy/model/[model]/year/[year]/page.tsx",
  "app/buy/country/[country]/year/[year]/page.tsx",
  "app/buy/brand/[brand]/model/[model]/country/[country]/page.tsx",
  "app/buy/brand/[brand]/model/[model]/year/[year]/page.tsx",
  "app/buy/brand/[brand]/country/[country]/year/[year]/page.tsx",
  "app/buy/brand/[brand]/model/[model]/country/[country]/year/[year]/page.tsx",
];

function getPolicyForFile(rel) {
  const normalized = rel.replace(/\\/g, "/");
  const hasYear = normalized.includes("/year/[year]/");
  const dimensions = (normalized.match(/\[[^\]]+\]/g) || []).length;
  return { dimensions, hasYear };
}

function ensureImport(source, rel) {
  if (source.includes('from "@/lib/seo/thinPageGuard"')) return source;

  const importLine =
    'import { programmaticPageRobots } from "@/lib/seo/thinPageGuard";\n';

  const prismaImportIdx = source.indexOf('from "@/lib/db"');
  if (prismaImportIdx !== -1) {
    const lineStart = source.lastIndexOf("\n", prismaImportIdx) + 1;
    return source.slice(0, lineStart) + importLine + source.slice(lineStart);
  }

  const firstImportIdx = source.indexOf("import ");
  if (firstImportIdx !== -1) {
    return source.slice(0, firstImportIdx) + importLine + source.slice(firstImportIdx);
  }

  return importLine + source;
}

function replaceRobotsExpression(source, rel) {
  const { dimensions, hasYear } = getPolicyForFile(rel);

  const replacement = `robots: programmaticPageRobots({ listingCount: total, dimensions: ${dimensions}, hasYear: ${hasYear} }),`;

  const patterns = [
    /robots:\s*total\s*>\s*0\s*\?\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}\s*:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}\s*,/g,
    /robots:\s*total\s*\?\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}\s*:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}\s*,/g,
    /robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\},/g,
  ];

  let out = source;
  let replaced = false;

  for (const pattern of patterns) {
    if (pattern.test(out)) {
      out = out.replace(pattern, replacement);
      replaced = true;
      break;
    }
  }

  return { out, replaced };
}

function removeDebugBrandVariants(source) {
  return source.replace(
    /\n\s*<[^>]*>\s*Matching DB brand variants for[\s\S]*?<\/[^>]+>\s*/g,
    "\n"
  );
}

let changed = 0;
let skipped = 0;

for (const rel of targets) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.log(`skip missing: ${rel}`);
    skipped += 1;
    continue;
  }

  let source = fs.readFileSync(file, "utf8");
  const before = source;

  source = ensureImport(source, rel);

  const result = replaceRobotsExpression(source, rel);
  source = result.out;

  source = removeDebugBrandVariants(source);

  if (source !== before) {
    fs.writeFileSync(file, source);
    changed += 1;
    console.log(`updated: ${rel}`);
  } else {
    skipped += 1;
    console.log(`no change: ${rel}`);
  }
}

console.log(`\nDone. changed=${changed} skipped=${skipped}`);
