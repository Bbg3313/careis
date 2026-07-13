"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminUser } from "@/lib/admin-auth";
import {
  adminCancelOrder,
  adminDeleteOrder,
  markAdminOrderDelivered,
  syncOrderDeliveryFromSweetTracker,
  updateOrderAdminFields,
} from "@/lib/orders";

function orderDetailPath(orderNumber: string, query?: Record<string, string>) {
  const base = `/admin/orders/${encodeURIComponent(orderNumber)}`;
  if (!query || Object.keys(query).length === 0) return base;
  const sp = new URLSearchParams(query);
  return `${base}?${sp.toString()}`;
}

export async function saveOrderAdminForm(orderNumber: string, formData: FormData) {
  await requireAdminUser();

  await updateOrderAdminFields(orderNumber, {
    carrier: String(formData.get("carrier") ?? ""),
    trackingNumber: String(formData.get("trackingNumber") ?? ""),
    trackingCarrierCode: String(formData.get("trackingCarrierCode") ?? ""),
    adminNote: String(formData.get("adminNote") ?? ""),
  });

  await syncOrderDeliveryFromSweetTracker(orderNumber, { ignoreInterval: true });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
}

export async function markOrderDeliveredForm(orderNumber: string) {
  await requireAdminUser();
  await markAdminOrderDelivered(orderNumber);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${encodeURIComponent(orderNumber)}`);
  redirect(`/admin/orders/${encodeURIComponent(orderNumber)}`);
}

export async function cancelOrderPaymentForm(orderNumber: string, formData: FormData) {
  await requireAdminUser();

  const reason = String(formData.get("cancelReason") ?? "").trim();
  const confirmText = String(formData.get("confirmCancel") ?? "").trim();

  if (confirmText !== "취소") {
    redirect(
      orderDetailPath(orderNumber, {
        cancelError: "확인을 위해 입력란에 「취소」라고 적어 주세요.",
      }),
    );
  }

  try {
    await adminCancelOrder(orderNumber, { reason });
  } catch (e) {
    const message = e instanceof Error ? e.message : "주문 취소에 실패했습니다.";
    redirect(orderDetailPath(orderNumber, { cancelError: message }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${encodeURIComponent(orderNumber)}`);
  redirect(orderDetailPath(orderNumber, { cancelOk: "1" }));
}

export async function deleteOrderForm(orderNumber: string, formData: FormData) {
  await requireAdminUser();

  const confirmText = String(formData.get("confirmDelete") ?? "").trim();
  if (confirmText !== "삭제") {
    redirect(
      orderDetailPath(orderNumber, {
        deleteError: "확인을 위해 입력란에 「삭제」라고 적어 주세요.",
      }),
    );
  }

  try {
    await adminDeleteOrder(orderNumber);
  } catch (e) {
    const message = e instanceof Error ? e.message : "주문 삭제에 실패했습니다.";
    redirect(orderDetailPath(orderNumber, { deleteError: message }));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  redirect(`/admin/orders?deleted=${encodeURIComponent(orderNumber)}`);
}
