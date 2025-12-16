// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env.local (dev) and your deployment env vars.",
  );
}

export default defineConfig({
  migrations: {
    seed: "pnpm tsx prisma/seed.ts",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
