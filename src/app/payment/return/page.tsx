import { PaymentReturnHandler } from "@/components/payment-return-handler";

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
