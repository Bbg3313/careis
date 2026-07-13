-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerCancelRequestedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerCancelReason" TEXT;
