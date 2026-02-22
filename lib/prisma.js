import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient({
  log: ["error"],
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
