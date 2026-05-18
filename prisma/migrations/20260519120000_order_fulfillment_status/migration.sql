-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('AWAITING_SHIP', 'IN_TRANSIT', 'DELIVERED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "fulfillmentStatus" "FulfillmentStatus",
ADD COLUMN "deliveredAt" TIMESTAMP(3);

UPDATE "Order"
SET "fulfillmentStatus" = CASE
  WHEN "paymentStatus" = 'PAID' AND COALESCE(TRIM("trackingNumber"), '') <> '' THEN 'IN_TRANSIT'::"FulfillmentStatus"
  WHEN "paymentStatus" = 'PAID' THEN 'AWAITING_SHIP'::"FulfillmentStatus"
  ELSE NULL
END;
