import { PrismaClient } from "@prisma/client";
import { env } from "@khenzii-dev/env";

const globalForPrisma: typeof globalThis & { prisma?: PrismaClient } = globalThis;

export const db: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
