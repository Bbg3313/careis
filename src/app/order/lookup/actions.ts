"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  customerCancelOrder,
  customerRequestCancelOrRefund,
  lookupCustomerOrdersByNameAndPhone,
} from "@/lib/orders";

function lookupPath(query: Record<string, string>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) sp.set(key, value);
  }
  const qs = sp.toString();
  return qs ? `/order/lookup?${qs}` : "/order/lookup";
}

export async function lookupOrderForm(formData: FormData) {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (customerName.replace(/\s+/g, "").length < 2) {
    redirect(lookupPath({ error: "주문자 이름을 입력해 주세요." }));
  }
  if (phone.replace(/\D/g, "").length < 10) {
    redirect(lookupPath({ error: "휴대폰 번호를 확인해 주세요. (예: 010-1234-5678)" }));
  }

  const orders = await lookupCustomerOrdersByNameAndPhone(customerName, phone);
  if (orders.length === 0) {
    redirect(
      lookupPath({
        customerName,
        phone,
        error: "일치하는 주문이 없습니다. 주문 시 입력한 이름·연락처를 확인해 주세요.",
      }),
    );
  }

  if (orders.length === 1) {
    redirect(
      lookupPath({
        customerName,
        phone,
        orderNumber: orders[0]!.orderNumber,
      }),
    );
  }

  redirect(lookupPath({ customerName, phone }));
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
