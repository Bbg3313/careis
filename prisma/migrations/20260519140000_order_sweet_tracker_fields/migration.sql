-- AlterTable
ALTER TABLE "Order" ADD COLUMN "trackingCarrierCode" TEXT,
ADD COLUMN "lastSweetTrackerPollAt" TIMESTAMP(3);
