import { defineConfig, env } from "prisma/config";
import process from "node:process";

process.loadEnvFile?.(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "node prisma/seed.cjs",
  },
});
