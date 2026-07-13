"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { customerCancelOrder, customerRequestCancelOrRefund } from "@/lib/orders";

function lookupPath(query: Record<string, string>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) sp.set(key, value);
  }
  const qs = sp.toString();
  return qs ? `/order/lookup?${qs}` : "/order/lookup";
}

export async function customerCancelForm(formData: FormData) {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  try {
    await customerCancelOrder(orderNumber, phone, customerName, reason);
  } catch (e) {
    const message = e instanceof Error ? e.message : "취소 처리에 실패했습니다.";
    redirect(lookupPath({ customerName, phone, orderNumber, error: message }));
  }

  revalidatePath("/order/lookup");
  redirect(lookupPath({ customerName, phone, orderNumber, ok: "cancelled" }));
}

export async function customerRefundRequestForm(formData: FormData) {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  try {
    await customerRequestCancelOrRefund(orderNumber, phone, customerName, reason);
  } catch (e) {
    const message = e instanceof Error ? e.message : "요청 접수에 실패했습니다.";
    redirect(lookupPath({ customerName, phone, orderNumber, error: message }));
  }

  revalidatePath("/order/lookup");
  redirect(lookupPath({ customerName, phone, orderNumber, ok: "requested" }));
}
