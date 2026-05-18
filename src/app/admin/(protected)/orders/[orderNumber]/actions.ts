"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminUser } from "@/lib/admin-auth";
import { markAdminOrderDelivered, updateOrderAdminFields } from "@/lib/orders";

export async function saveOrderAdminForm(orderNumber: string, formData: FormData) {
  await requireAdminUser();

  await updateOrderAdminFields(orderNumber, {
    carrier: String(formData.get("carrier") ?? ""),
    trackingNumber: String(formData.get("trackingNumber") ?? ""),
    adminNote: String(formData.get("adminNote") ?? ""),
  });

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
