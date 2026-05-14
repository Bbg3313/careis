import type { Metadata } from "next";

import { PaymentReturnHandler } from "@/components/payment-return-handler";
import { noIndexPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = {
  ...noIndexPageMetadata,
  title: "결제 처리",
  description: "결제 승인 결과를 확인하는 페이지입니다.",
};

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderNumber?: string;
    orderId?: string;
    amount?: string;
    paymentMethod?: string;
    provider?: string;
    reference?: string;
    paymentKey?: string;
  }>;
}) {
  const params = await searchParams;
  const orderNumber = params.orderId ?? params.orderNumber ?? "";

  return (
    <div className="pb-24">
      <PaymentReturnHandler
        orderNumber={orderNumber}
        amount={Number(params.amount ?? "0")}
        paymentMethod={params.paymentMethod ?? "CREDIT_CARD"}
        provider={params.provider ?? "TOSS_PAYMENTS"}
        reference={params.reference ?? params.paymentKey ?? null}
        token={params.paymentKey ?? null}
      />
    </div>
  );
}
