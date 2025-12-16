// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing.");
}

const DIRECT_DATABASE_URL = process.env.DIRECT_DATABASE_URL;

// ✅ IMPORTANT:
// Prisma CLI (migrate/push/pull) should use DIRECT_DATABASE_URL if present (non-pooler).
// Otherwise it falls back to DATABASE_URL.
const CLI_URL = DIRECT_DATABASE_URL ?? DATABASE_URL;

export default defineConfig({
  migrations: {
    seed: "pnpm tsx prisma/seed.ts",
  },
  datasource: {
    url: CLI_URL,
  },
});
