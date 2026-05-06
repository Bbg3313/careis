import { PaymentReturnHandler } from "@/components/payment-return-handler";

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderNumber?: string;
    amount?: string;
    paymentMethod?: string;
    provider?: string;
    reference?: string;
    paymentKey?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="pb-24">
      <PaymentReturnHandler
        orderNumber={params.orderNumber ?? ""}
        amount={Number(params.amount ?? "0")}
        paymentMethod={params.paymentMethod ?? "CREDIT_CARD"}
        provider={params.provider ?? "EXTERNAL_PG"}
        reference={params.reference ?? null}
        token={params.paymentKey ?? null}
      />
    </div>
  );
}
