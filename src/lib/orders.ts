import { FulfillmentStatus, OrderStatus, PaymentMethod, ProductStatus, type Prisma } from "@prisma/client";
import { z } from "zod";

import { orderMatchesAdminFulfillmentFilter } from "@/lib/admin-fulfillment";
import { prismaOrderCreatedAtRange } from "@/lib/admin-orders-date-filter";
import { prisma } from "@/lib/db";
import { computeOrderPricing, resolveAppliedPromoCampaign } from "@/lib/promo";
import { fetchSweetTrackerDeliveryComplete } from "@/lib/sweet-tracker";
import { getProductBySlug } from "@/lib/product-data";
import { sanitizeReferralCode } from "@/lib/referral";

const orderItemSchema = z.object({
  productSlug: z.enum(["sun-pack", "illuminator"]),
  quantity: z.coerce.number().int().min(1).max(10),
});

export const createOrderSchema = z
  .object({
    items: z.array(orderItemSchema).min(1).max(2).optional(),
    productSlug: z.enum(["sun-pack", "illuminator"]).optional(),
    quantity: z.coerce.number().int().min(1).max(10).optional(),
  customerName: z.string().min(2).max(30),
  phone: z.string().min(8).max(20),
  postalCode: z.string().min(3).max(10),
  address: z.string().min(5).max(120),
  memo: z.string().max(300).optional().or(z.literal("")),
  couponCode: z.string().max(40).optional().or(z.literal("")),
  paymentMethod: z.nativeEnum(PaymentMethod),
    referralCode: z.string().optional().nullable(),
  })
  .refine((value) => (value.items?.length ?? 0) > 0 || Boolean(value.productSlug), {
    message: "최소 1개 이상의 상품을 선택해주세요.",
    path: ["items"],
  });

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

type PaymentRequestMetadata = {
  provider: string;
  payload: string;
  reference?: string | null;
  token?: string | null;
};

type PaymentConfirmationInput = {
  orderNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  provider: string;
  reference?: string | null;
  token?: string | null;
  payload?: string | null;
};

type PaymentFailureInput = {
  orderNumber: string;
  code?: string | null;
  message?: string | null;
  payload?: string | null;
};

function createOrderNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CR-${datePart}-${randomPart}`;
}

export async function createOrder(input: CreateOrderInput) {
  const parsed = createOrderSchema.parse(input);
  const normalizedItems = (parsed.items?.length
    ? parsed.items
    : parsed.productSlug
      ? [{ productSlug: parsed.productSlug, quantity: parsed.quantity ?? 1 }]
      : []
  ).reduce<Array<{ productSlug: "sun-pack" | "illuminator"; quantity: number }>>((accumulator, item) => {
    const existing = accumulator.find((entry) => entry.productSlug === item.productSlug);
    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + item.quantity);
      return accumulator;
    }

    accumulator.push({
      productSlug: item.productSlug,
      quantity: item.quantity,
    });

    return accumulator;
  }, []);

  if (normalizedItems.length === 0) {
    throw new Error("최소 1개 이상의 상품을 선택해주세요.");
  }

  const products = await prisma.product.findMany({
    where: {
      slug: { in: normalizedItems.map((item) => item.productSlug) },
      status: ProductStatus.ACTIVE,
    },
  });

  if (products.length !== normalizedItems.length) {
    throw new Error("선택한 상품 정보를 일부 찾을 수 없습니다.");
  }

  const referralCode = sanitizeReferralCode(parsed.referralCode);
  const couponStored = parsed.couponCode?.trim() ? parsed.couponCode.trim() : null;

  const campaign = await resolveAppliedPromoCampaign(couponStored, referralCode);
  const pricing = computeOrderPricing(normalizedItems, products, campaign);

  if (pricing.lines.length !== normalizedItems.length) {
    throw new Error("선택한 상품 정보를 일부 찾을 수 없습니다.");
  }

  return prisma.order.create({
    data: {
      orderNumber: createOrderNumber(),
      customerName: parsed.customerName,
      phone: parsed.phone,
      postalCode: parsed.postalCode,
      address: parsed.address,
      memo: parsed.memo || null,
      couponCode: couponStored,
      paymentMethod: parsed.paymentMethod,
      paymentStatus: OrderStatus.PENDING,
      fulfillmentStatus: null,
      deliveredAt: null,
      referralCode,
      appliedPromoCode: pricing.appliedPromo?.code ?? null,
      totalAmount: pricing.totalAmount,
      orderItems: {
        create: pricing.lines.map((line) => {
          const product = products.find((entry) => entry.slug === line.productSlug);
          if (!product) {
            throw new Error("선택한 상품 정보를 찾을 수 없습니다.");
          }

          return {
            productId: product.id,
            sku: product.sku,
            productNameSnapshot: product.name,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          };
        }),
      },
    },
    include: {
      orderItems: true,
    },
  });
}

/** 프로덕션 등에서 DB 미구성 시 UI가 500이 되지 않도록 관리자 화면 전용 로더 */

export async function loadAdminOrdersOverview(dateQuery?: { from?: string; to?: string }): Promise<
  | {
      ok: true;
      stats: Awaited<ReturnType<typeof getOrderStats>>;
      orders: Awaited<ReturnType<typeof getRecentOrdersForAdmin>>;
    }
  | { ok: false }
> {
  try {
    const [stats, orders] = await Promise.all([
      getOrderStats(dateQuery),
      getRecentOrdersForAdmin(8, dateQuery),
    ]);
    return { ok: true, stats, orders };
  } catch (error) {
    console.error("[orders] admin overview load failed", error);
    return { ok: false };
  }
}

export async function loadAdminOrdersList(dateQuery?: { from?: string; to?: string }): Promise<
  | { ok: true; orders: Awaited<ReturnType<typeof getOrders>> }
  | { ok: false }
> {
  try {
    const orders = await getOrders(dateQuery);
    return { ok: true, orders };
  } catch (error) {
    console.error("[orders] admin orders list load failed", error);
    return { ok: false };
  }
}

export async function loadAdminOrderByNumber(orderNumber: string): Promise<
  | { ok: true; order: Awaited<ReturnType<typeof getOrderByNumber>> }
  | { ok: false }
> {
  try {
    const order = await getOrderByNumber(orderNumber);
    return { ok: true, order };
  } catch (error) {
    console.error("[orders] admin order detail load failed", error);
    return { ok: false };
  }
}

export async function getOrders(dateQuery?: { from?: string; to?: string }) {
  const dateWhere = prismaOrderCreatedAtRange(dateQuery?.from, dateQuery?.to);
  return prisma.order.findMany({
    where: Object.keys(dateWhere).length ? (dateWhere as Prisma.OrderWhereInput) : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: true,
    },
  });
}

export type OrdersExportFilter = {
  from?: string;
  to?: string;
  /** `ALL`이면 결제 상태로는 제한하지 않음 */
  status: "ALL" | "PAID" | "PENDING" | "CANCELLED_REFUNDED";
  /** 결제완료 주문에만 적용. `ALL`이면 배송 단계로는 제한하지 않음 */
  fulfillment: "ALL" | "AWAITING_SHIP" | "IN_TRANSIT" | "DELIVERED";
  /** 정규화된 코드 — 레퍼럴·적용 공구·쿠폰 중 하나라도 일치 */
  inflowCode?: string | null;
};

/** 엑셀보내기용: 기간·결제·배송·유입 코드 필터 */
export async function getOrdersForExport(filter: OrdersExportFilter) {
  const dateWhere = prismaOrderCreatedAtRange(filter.from, filter.to);
  const inflow = sanitizeReferralCode(filter.inflowCode ?? null);

  const andParts: Prisma.OrderWhereInput[] = [];
  if (Object.keys(dateWhere).length) {
    andParts.push(dateWhere as Prisma.OrderWhereInput);
  }

  if (filter.status === "PAID") {
    andParts.push({ paymentStatus: OrderStatus.PAID });
  } else if (filter.status === "PENDING") {
    andParts.push({ paymentStatus: OrderStatus.PENDING });
  } else if (filter.status === "CANCELLED_REFUNDED") {
    andParts.push({ paymentStatus: { in: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } });
  }

  if (inflow) {
    andParts.push({
      OR: [
        { referralCode: inflow },
        { appliedPromoCode: inflow },
        { couponCode: { equals: inflow, mode: "insensitive" } },
      ],
    });
  }

  const orders = await prisma.order.findMany({
    where: andParts.length ? { AND: andParts } : undefined,
    orderBy: { createdAt: "desc" },
    include: { orderItems: true },
  });

  if (filter.status !== "PAID" || filter.fulfillment === "ALL") {
    return orders;
  }

  return orders.filter((o) => orderMatchesAdminFulfillmentFilter(o, filter.fulfillment));
}

/** 주문에 한 번이라도 붙은 유입 코드 목록(레퍼럴·공구·쿠폰), 정렬 */
export async function listDistinctInflowCodesFromOrders(): Promise<string[]> {
  const [refs, promos, coupons] = await Promise.all([
    prisma.order.findMany({
      where: { referralCode: { not: null } },
      distinct: ["referralCode"],
      select: { referralCode: true },
    }),
    prisma.order.findMany({
      where: { appliedPromoCode: { not: null } },
      distinct: ["appliedPromoCode"],
      select: { appliedPromoCode: true },
    }),
    prisma.order.findMany({
      where: { couponCode: { not: null } },
      distinct: ["couponCode"],
      select: { couponCode: true },
    }),
  ]);

  const set = new Set<string>();
  for (const r of refs) {
    if (r.referralCode) set.add(r.referralCode);
  }
  for (const p of promos) {
    if (p.appliedPromoCode) set.add(p.appliedPromoCode);
  }
  for (const c of coupons) {
    const t = c.couponCode?.trim();
    if (t) set.add(t.toLowerCase());
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** 대시보드 등: 전체 스캔 없이 최근 주문만 */
export async function getRecentOrdersForAdmin(limit: number, dateQuery?: { from?: string; to?: string }) {
  const dateWhere = prismaOrderCreatedAtRange(dateQuery?.from, dateQuery?.to);
  return prisma.order.findMany({
    where: Object.keys(dateWhere).length ? (dateWhere as Prisma.OrderWhereInput) : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      orderItems: true,
    },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      orderItems: true,
    },
  });
}

const adminOrderUpdateSchema = z.object({
  carrier: z.string().max(40).optional().nullable(),
  trackingNumber: z.string().max(80).optional().nullable(),
  trackingCarrierCode: z.string().max(8).optional().nullable(),
  adminNote: z.string().max(2000).optional().nullable(),
});

export async function updateOrderAdminFields(
  orderNumber: string,
  input: z.infer<typeof adminOrderUpdateSchema>,
) {
  const parsed = adminOrderUpdateSchema.parse(input);
  const carrier = parsed.carrier?.trim() || null;
  const trackingNumber = parsed.trackingNumber?.trim() || null;
  const trackingCarrierCode = parsed.trackingCarrierCode?.trim() || null;
  const adminNote = parsed.adminNote?.trim() || null;

  const existing = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      shippedAt: true,
      paymentStatus: true,
      fulfillmentStatus: true,
      trackingNumber: true,
    },
  });
  if (!existing) {
    throw new Error("주문을 찾을 수 없습니다.");
  }

  if (existing.paymentStatus !== OrderStatus.PAID) {
    return prisma.order.update({
      where: { orderNumber },
      data: { carrier, trackingNumber, trackingCarrierCode, adminNote },
      include: { orderItems: true },
    });
  }

  if (existing.fulfillmentStatus === FulfillmentStatus.DELIVERED) {
    return prisma.order.update({
      where: { orderNumber },
      data: { carrier, trackingNumber, trackingCarrierCode, adminNote },
      include: { orderItems: true },
    });
  }

  const hasTracking = Boolean(trackingNumber);
  const fulfillmentStatus = hasTracking ? FulfillmentStatus.IN_TRANSIT : FulfillmentStatus.AWAITING_SHIP;
  const shippedAt = hasTracking ? existing.shippedAt ?? new Date() : null;

  return prisma.order.update({
    where: { orderNumber },
    data: {
      carrier,
      trackingNumber,
      trackingCarrierCode,
      adminNote,
      fulfillmentStatus,
      shippedAt,
    },
    include: { orderItems: true },
  });
}

export async function markAdminOrderDelivered(orderNumber: string) {
  const existing = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      paymentStatus: true,
      fulfillmentStatus: true,
      trackingNumber: true,
    },
  });
  if (!existing) {
    throw new Error("주문을 찾을 수 없습니다.");
  }
  if (existing.paymentStatus !== OrderStatus.PAID) {
    throw new Error("결제 완료된 주문만 배송완료 처리할 수 있습니다.");
  }
  if (!existing.trackingNumber?.trim()) {
    throw new Error("운송장 번호를 먼저 등록해 주세요.");
  }
  if (existing.fulfillmentStatus === FulfillmentStatus.DELIVERED) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: { orderItems: true },
    });
  }

  const hasTrack = Boolean(existing.trackingNumber?.trim());
  const inTransit =
    existing.fulfillmentStatus === FulfillmentStatus.IN_TRANSIT ||
    (existing.fulfillmentStatus === FulfillmentStatus.AWAITING_SHIP && hasTrack) ||
    (existing.fulfillmentStatus === null && hasTrack);

  if (!inTransit) {
    throw new Error("송장 등록 후(배송중)에만 배송완료 처리할 수 있습니다.");
  }

  return prisma.order.update({
    where: { orderNumber },
    data: {
      fulfillmentStatus: FulfillmentStatus.DELIVERED,
      deliveredAt: new Date(),
    },
    include: { orderItems: true },
  });
}

/** 관리자 상세 진입 등: 짧은 주기. 크론은 `syncDeliveryStatusBatchForCron`. */
export const SWEET_TRACKER_DETAIL_MIN_INTERVAL_MS = 12 * 60 * 1000;
const SWEET_TRACKER_CRON_MIN_INTERVAL_MS = 3 * 60 * 60 * 1000;

export type SyncDeliveryFromTrackerResult = "skipped" | "no_key" | "unchanged" | "updated";

/**
 * 스마트택배 API로 배송 완료 여부를 확인해 `DELIVERED`로 맞춥니다.
 * `SWEET_TRACKER_API_KEY`, 주문의 `trackingCarrierCode`·`trackingNumber`가 있어야 합니다.
 */
export async function syncOrderDeliveryFromSweetTracker(
  orderNumber: string,
  opts?: { minIntervalMs?: number; ignoreInterval?: boolean },
): Promise<SyncDeliveryFromTrackerResult> {
  const key = process.env.SWEET_TRACKER_API_KEY?.trim();
  if (!key) {
    return "no_key";
  }

  const minInterval = opts?.minIntervalMs ?? SWEET_TRACKER_CRON_MIN_INTERVAL_MS;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      trackingNumber: true,
      trackingCarrierCode: true,
      paymentStatus: true,
      fulfillmentStatus: true,
      lastSweetTrackerPollAt: true,
    },
  });
  if (!order) return "skipped";
  if (order.paymentStatus !== OrderStatus.PAID) return "skipped";
  if (order.fulfillmentStatus === FulfillmentStatus.DELIVERED) return "unchanged";

  const inv = order.trackingNumber?.trim();
  const code = order.trackingCarrierCode?.trim();
  if (!inv || !code) return "skipped";

  if (!opts?.ignoreInterval && order.lastSweetTrackerPollAt) {
    const elapsed = Date.now() - order.lastSweetTrackerPollAt.getTime();
    if (elapsed < minInterval) return "unchanged";
  }

  const poll = await fetchSweetTrackerDeliveryComplete(code, inv);

  if (poll.httpOk && poll.deliveryComplete) {
    await prisma.order.update({
      where: { orderNumber },
      data: {
        fulfillmentStatus: FulfillmentStatus.DELIVERED,
        deliveredAt: new Date(),
        lastSweetTrackerPollAt: new Date(),
      },
    });
    return "updated";
  }

  await prisma.order.update({
    where: { orderNumber },
    data: { lastSweetTrackerPollAt: new Date() },
  });
  return "unchanged";
}

/** Vercel Cron 등: 조회 가능한 배송중 주문을 일괄 동기화 */
export async function syncDeliveryStatusBatchForCron(maxOrders = 40) {
  const key = process.env.SWEET_TRACKER_API_KEY?.trim();
  if (!key) {
    return { polled: 0, updated: 0, skippedNoKey: true as const };
  }

  const threshold = new Date(Date.now() - SWEET_TRACKER_CRON_MIN_INTERVAL_MS);
  const rows = await prisma.order.findMany({
    where: {
      paymentStatus: OrderStatus.PAID,
      fulfillmentStatus: { not: FulfillmentStatus.DELIVERED },
      trackingCarrierCode: { not: null },
      OR: [{ lastSweetTrackerPollAt: null }, { lastSweetTrackerPollAt: { lt: threshold } }],
    },
    select: { orderNumber: true, trackingNumber: true, trackingCarrierCode: true },
    take: maxOrders * 2,
    orderBy: { lastSweetTrackerPollAt: "asc" },
  });

  const eligible = rows.filter((r) => r.trackingNumber?.trim() && r.trackingCarrierCode?.trim()).slice(0, maxOrders);

  let updated = 0;
  for (const row of eligible) {
    const r = await syncOrderDeliveryFromSweetTracker(row.orderNumber, {
      minIntervalMs: SWEET_TRACKER_CRON_MIN_INTERVAL_MS,
    });
    if (r === "updated") updated += 1;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return { polled: eligible.length, updated, skippedNoKey: false as const };
}

const NON_EMPTY_TRACK: Prisma.OrderWhereInput = {
  AND: [{ trackingNumber: { not: null } }, { NOT: { trackingNumber: "" } }],
};

export async function getOrderStats(dateQuery?: { from?: string; to?: string }) {
  const dateWhere = prismaOrderCreatedAtRange(dateQuery?.from, dateQuery?.to);
  const base = (Object.keys(dateWhere).length ? dateWhere : {}) as Prisma.OrderWhereInput;
  const paidBase: Prisma.OrderWhereInput = { ...base, paymentStatus: OrderStatus.PAID };
  const notDelivered: Prisma.OrderWhereInput = {
    ...paidBase,
    fulfillmentStatus: { not: FulfillmentStatus.DELIVERED },
  };
  const inTransitWhere: Prisma.OrderWhereInput = {
    ...notDelivered,
    OR: [{ fulfillmentStatus: FulfillmentStatus.IN_TRANSIT }, NON_EMPTY_TRACK],
  };
  const [all, pending, paid, cancelled, refunded, paidDelivered, paidInTransit, paidAwaitingShip] =
    await Promise.all([
      prisma.order.count({ where: base }),
      prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.PENDING } }),
      prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.PAID } }),
      prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.CANCELLED } }),
      prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.REFUNDED } }),
      prisma.order.count({
        where: { ...paidBase, fulfillmentStatus: FulfillmentStatus.DELIVERED },
      }),
      prisma.order.count({ where: inTransitWhere }),
      prisma.order.count({
        where: {
          ...notDelivered,
          NOT: { OR: [{ fulfillmentStatus: FulfillmentStatus.IN_TRANSIT }, NON_EMPTY_TRACK] },
        },
      }),
    ]);
  return { all, pending, paid, cancelled, refunded, paidAwaitingShip, paidInTransit, paidDelivered };
}

export async function setOrderPaymentRequested(orderNumber: string, metadata: PaymentRequestMetadata) {
  return prisma.order.update({
    where: { orderNumber },
    data: {
      paymentProvider: metadata.provider,
      paymentPayload: metadata.payload,
      paymentReference: metadata.reference ?? null,
      paymentToken: metadata.token ?? null,
      paymentRequestedAt: new Date(),
      paymentFailureCode: null,
      paymentFailureMessage: null,
    },
    include: {
      orderItems: true,
    },
  });
}

export async function confirmOrderPayment(input: PaymentConfirmationInput) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: input.orderNumber },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  }

  if (order.paymentStatus === OrderStatus.PAID) {
    return order;
  }

  if (order.totalAmount !== input.amount) {
    throw new Error("결제 금액이 주문 금액과 일치하지 않습니다.");
  }

  return prisma.order.update({
    where: { orderNumber: input.orderNumber },
    data: {
      paymentStatus: OrderStatus.PAID,
      paymentMethod: input.paymentMethod,
      paymentProvider: input.provider,
      paymentReference: input.reference ?? order.paymentReference,
      paymentToken: input.token ?? order.paymentToken,
      paymentPayload: input.payload ?? order.paymentPayload,
      paidAt: new Date(),
      cancelledAt: null,
      refundedAt: null,
      paymentFailureCode: null,
      paymentFailureMessage: null,
      fulfillmentStatus: FulfillmentStatus.AWAITING_SHIP,
      deliveredAt: null,
    },
    include: {
      orderItems: true,
    },
  });
}

export async function failOrderPayment(input: PaymentFailureInput) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: input.orderNumber },
  });

  if (!order) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  }

  return prisma.order.update({
    where: { orderNumber: input.orderNumber },
    data: {
      paymentStatus: OrderStatus.CANCELLED,
      cancelledAt: new Date(),
      paymentFailureCode: input.code ?? null,
      paymentFailureMessage: input.message ?? "결제가 승인되지 않았습니다.",
      paymentPayload: input.payload ?? order.paymentPayload,
      fulfillmentStatus: null,
      deliveredAt: null,
      trackingCarrierCode: null,
      lastSweetTrackerPollAt: null,
    },
  });
}

export async function refundOrderPayment(orderNumber: string, payload?: string | null) {
  return prisma.order.update({
    where: { orderNumber },
    data: {
      paymentStatus: OrderStatus.REFUNDED,
      refundedAt: new Date(),
      paymentPayload: payload ?? undefined,
      fulfillmentStatus: null,
      deliveredAt: null,
      trackingCarrierCode: null,
      lastSweetTrackerPollAt: null,
    },
    include: {
      orderItems: true,
    },
  });
}

export async function getProductSummaryForSlug(slug: string) {
  const content = getProductBySlug(slug);
  if (!content) return null;

  const product = await prisma.product.findUnique({
    where: { slug: content.slug },
  });

  return {
    ...content,
    productId: product?.id ?? null,
  };
}
