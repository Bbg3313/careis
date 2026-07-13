"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  customerCancelOrder,
  customerRequestCancelOrRefund,
  lookupCustomerOrder,
} from "@/lib/orders";

function lookupPath(query: Record<string, string>) {
  const sp = new URLSearchParams(query);
  return `/order/lookup?${sp.toString()}`;
}

export async function lookupOrderForm(formData: FormData) {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const order = await lookupCustomerOrder(orderNumber, phone);
  if (!order) {
    redirect(
      lookupPath({
        error: "주문번호 또는 연락처가 일치하지 않습니다. 주문 완료 화면에 나온 정보를 확인해 주세요.",
      }),
    );
  }

  redirect(
    lookupPath({
      orderNumber: order.orderNumber,
      phone,
    }),
  );
}

export async function customerCancelForm(formData: FormData) {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  try {
    await customerCancelOrder(orderNumber, phone, reason);
  } catch (e) {
    const message = e instanceof Error ? e.message : "취소 처리에 실패했습니다.";
    redirect(lookupPath({ orderNumber, phone, error: message }));
  }

  revalidatePath("/order/lookup");
  redirect(lookupPath({ orderNumber, phone, ok: "cancelled" }));
}

export async function customerRefundRequestForm(formData: FormData) {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  try {
    await customerRequestCancelOrRefund(orderNumber, phone, reason);
  } catch (e) {
    const message = e instanceof Error ? e.message : "요청 접수에 실패했습니다.";
    redirect(lookupPath({ orderNumber, phone, error: message }));
  }

  revalidatePath("/order/lookup");
  redirect(lookupPath({ orderNumber, phone, ok: "requested" }));
}
