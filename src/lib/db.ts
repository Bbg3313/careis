import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

/** 서버리스·프로덕션에서도 동일 인스턴스 재사용 (미지정 시 요청마다 PrismaClient 생성 → DB max clients 도달) */
globalForPrisma.prisma = prisma;
