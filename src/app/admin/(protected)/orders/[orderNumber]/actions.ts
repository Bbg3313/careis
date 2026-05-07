"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/lib/admin-auth";
import { updateOrderAdminFields } from "@/lib/orders";

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
