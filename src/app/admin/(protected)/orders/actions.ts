"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/lib/admin-auth";
import { registerOrderShipments } from "@/lib/orders";

export type RegisterShipmentItemInput = {
  orderNumber: string;
  trackingCarrierCode: string;
  trackingNumber: string;
};

export async function registerShipmentsAction(items: RegisterShipmentItemInput[]) {
  await requireAdminUser();

  if (!items.length) {
    return { ok: false as const, message: "송장 등록할 주문을 선택해 주세요." };
  }

  const { registered, errors } = await registerOrderShipments(items);

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  for (const orderNumber of registered) {
    revalidatePath(`/admin/orders/${encodeURIComponent(orderNumber)}`);
  }

  if (registered.length === 0) {
    return {
      ok: false as const,
      message: errors[0] ?? "송장 등록에 실패했습니다.",
      errors,
    };
  }

  return {
    ok: true as const,
    registeredCount: registered.length,
    errors,
  };
}
