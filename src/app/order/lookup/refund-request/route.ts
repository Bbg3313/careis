import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { customerRequestCancelOrRefund } from "@/lib/orders";

export const runtime = "nodejs";

function redirectLookup(request: Request, query: Record<string, string>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) sp.set(key, value);
  }
  const url = new URL("/order/lookup", request.url);
  url.search = sp.toString();
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const orderNumber = String(form.get("orderNumber") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const customerName = String(form.get("customerName") ?? "").trim();
  const reason = String(form.get("reason") ?? "").trim();

  try {
    await customerRequestCancelOrRefund(orderNumber, phone, customerName, reason);
  } catch (e) {
    const message = e instanceof Error ? e.message : "요청 접수에 실패했습니다.";
    return redirectLookup(request, { customerName, phone, orderNumber, error: message });
  }

  revalidatePath("/order/lookup");
  return redirectLookup(request, { customerName, phone, orderNumber, ok: "requested" });
}
