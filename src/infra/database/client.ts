import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env";
import { PrismaClient } from "@/shared/prisma";

function makePrismaClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL is not defined");

  const url = new URL(connectionString);
  const schema = url.searchParams.get("schema") ?? "public";

  // Workaround conhecido: setar schema explicitamente no adapter
  const adapter = new PrismaPg({ connectionString }, { schema });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "dev" ? ["query", "error", "warn"] : ["error"],
  });
}

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? makePrismaClient();

if (env.NODE_ENV === "dev") {
  globalThis.__prisma = prisma;
}
