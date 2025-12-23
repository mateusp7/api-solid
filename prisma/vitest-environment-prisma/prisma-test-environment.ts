import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { Environment } from "vitest/environments";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  // reforça o schema padrão da conexão (search_path)
  // URLSearchParams vai fazer o encode automaticamente.
  url.searchParams.set("options", `-csearch_path=${schema}`);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  viteEnvironment: "ssr",
  async setup() {
    // Criar o banco de testes
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        const url = new URL(process.env.DATABASE_URL!);
        const schema = url.searchParams.get("schema")!;

        const adapter = new PrismaPg(
          { connectionString: process.env.DATABASE_URL! },
          { schema }
        );
        const prisma = new PrismaClient({ adapter });

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );
        await prisma.$disconnect();
      },
    };
  },
};
