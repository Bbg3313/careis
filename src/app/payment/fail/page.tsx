import type { Metadata } from "next";

import { PaymentFailHandler } from "@/components/payment-fail-handler";
import { noIndexPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = {
  ...noIndexPageMetadata,
  title: "결제 실패",
  description: "결제가 완료되지 않았을 때 안내 화면입니다.",
};

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderNumber?: string;
    orderId?: string;
    code?: string;
    message?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="pb-24">
      <PaymentFailHandler
        orderNumber={params.orderNumber ?? params.orderId ?? ""}
        code={params.code ?? "PAYMENT_FAILED"}
        message={params.message ?? "결제가 완료되지 않았습니다."}
      />
    </div>
  );
}
