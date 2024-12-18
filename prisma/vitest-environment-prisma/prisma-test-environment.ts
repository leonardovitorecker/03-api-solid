import "dotenv/config";
import { randomUUID } from "crypto";
import { Environment } from "vitest";
//postgresql://postgres:postgres@localhost:5432/03-api-solid?schema=public

function generateDatabaseUrl(schema: string): string {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  return url.toString();
}
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});
export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);
    process.env.DATABASE_URL = databaseUrl;
    execSync("npx prisma migrate deploy");
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`
        );

        await prisma.$disconnect();
      },
    };
  },
};
