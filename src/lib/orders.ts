import { FulfillmentStatus, OrderStatus, PaymentMethod, ProductStatus, type Prisma } from "@prisma/client";
import { z } from "zod";

import { adminFulfillmentLabel, isPaidOrderAwaitingShipment, orderMatchesAdminFulfillmentFilter } from "@/lib/admin-fulfillment";
import { adminOrderSearchToPrismaWhere, parseAdminOrdersListSearch } from "@/lib/admin-order-search";
import { prismaOrderCreatedAtRange } from "@/lib/admin-orders-date-filter";
import { prisma } from "@/lib/db";
import { computeOrderPricing, resolveAppliedPromoCampaign } from "@/lib/promo";
import { fetchSweetTrackerDeliveryComplete } from "@/lib/sweet-tracker";
import { SWEET_TRACKER_CARRIER_OPTIONS } from "@/lib/sweet-tracker-carriers";
import { getProductBySlug } from "@/lib/product-data";
import { sanitizeReferralCode } from "@/lib/referral";
import { cancelTossPaymentOnServer } from "@/lib/toss-payments";
import { formatKoreanMobileDisplay } from "@/lib/phone-format";
import {
  CHANGE_OF_MIND_SHIPPING_FEE,
  refundAmountAfterChangeOfMindFee,
} from "@/lib/refund-policy";

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
  /** 주문 단계에서는 고르지 않음. 토스 결제창에서 실제 수단 선택(미입력 시 카드 플로우 기본값). */
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CREDIT_CARD),
    referralCode: z.string().optional().nullable(),
  })
  .refine((value) => (value.items?.length ?? 0) > 0 || Boolean(value.productSlug), {
    message: "최소 1개 이상의 상품을 선택해주세요.",
    path: ["items"],
  });

export type CreateOrderInput = z.input<typeof createOrderSchema>;

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
      customerName: parsed.customerName.trim(),
      phone: formatKoreanMobileDisplay(parsed.phone),
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

/** 관리자 주문 목록: 한 번에 가져오는 행 상한(응답 속도). 총건수는 `totalMatching`. */
export const ADMIN_ORDER_LIST_TAKE = 80;

const adminOrdersListSelect = {
  id: true,
  orderNumber: true,
  createdAt: true,
  customerName: true,
  phone: true,
  paymentStatus: true,
  fulfillmentStatus: true,
  carrier: true,
  trackingCarrierCode: true,
  trackingNumber: true,
  customerCancelRequestedAt: true,
  customerCancelReason: true,
  totalAmount: true,
  referralCode: true,
  appliedPromoCode: true,
  couponCode: true,
  orderItems: { select: { productNameSnapshot: true, quantity: true } },
} satisfies Prisma.OrderSelect;

export type AdminOrderListRow = Prisma.OrderGetPayload<{ select: typeof adminOrdersListSelect }>;

function mergeOrderWhere(a: Prisma.OrderWhereInput, b: Prisma.OrderWhereInput): Prisma.OrderWhereInput {
  return { AND: [a, b] };
}

function buildAdminPaidDateBaseWhere(from?: string, to?: string): Prisma.OrderWhereInput {
  const and: Prisma.OrderWhereInput[] = [];
  const dateWhere = prismaOrderCreatedAtRange(from, to);
  if (Object.keys(dateWhere).length) {
    and.push(dateWhere as Prisma.OrderWhereInput);
  }
  and.push({ paymentStatus: OrderStatus.PAID });
  return and.length === 1 ? and[0]! : { AND: and };
}

const nonEmptyTrackingWhere: Prisma.OrderWhereInput = {
  AND: [{ trackingNumber: { not: null } }, { NOT: { trackingNumber: "" } }],
};

const inTransitOrHasTrackingWhere: Prisma.OrderWhereInput = {
  OR: [{ fulfillmentStatus: FulfillmentStatus.IN_TRANSIT }, nonEmptyTrackingWhere],
};

/** 결제완료·기간 내 `orderMatchesAdminFulfillmentFilter(..., AWAITING_SHIP)` 와 동일 */
const awaitingShipInPaidWhere: Prisma.OrderWhereInput = {
  AND: [{ NOT: { fulfillmentStatus: FulfillmentStatus.DELIVERED } }, { NOT: inTransitOrHasTrackingWhere }],
};

/** 고객이 남긴 환불·취소 요청 대기 (관리자 미처리) */
export const pendingCustomerCancelRequestWhere: Prisma.OrderWhereInput = {
  customerCancelRequestedAt: { not: null },
  paymentStatus: OrderStatus.PAID,
};

function buildAdminOrdersListWhere(input: {
  from?: string;
  to?: string;
  status?: string;
  fulfillment?: string;
  /** `cancelRequest`이면 고객 환불요청 대기만 */
  queue?: string;
  search: ReturnType<typeof parseAdminOrdersListSearch>;
}): Prisma.OrderWhereInput {
  const and: Prisma.OrderWhereInput[] = [];
  const dateWhere = prismaOrderCreatedAtRange(input.from, input.to);
  if (Object.keys(dateWhere).length) {
    and.push(dateWhere as Prisma.OrderWhereInput);
  }

  if (input.queue === "cancelRequest") {
    and.push(pendingCustomerCancelRequestWhere);
  } else {
    const st = input.status?.trim();
    if (st === "PAID") {
      and.push({ paymentStatus: OrderStatus.PAID });
    } else if (st === "PENDING") {
      and.push({ paymentStatus: OrderStatus.PENDING });
    } else if (st === "CANCELLED_REFUNDED") {
      and.push({ paymentStatus: { in: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } });
    }

    if (st === "PAID") {
      const ful = input.fulfillment?.trim();
      if (ful && ful !== "ALL") {
        if (ful === "DELIVERED") {
          and.push({ fulfillmentStatus: FulfillmentStatus.DELIVERED });
        } else if (ful === "IN_TRANSIT") {
          and.push({
            NOT: { fulfillmentStatus: FulfillmentStatus.DELIVERED },
            OR: [
              { fulfillmentStatus: FulfillmentStatus.IN_TRANSIT },
              nonEmptyTrackingWhere,
            ],
          });
        } else if (ful === "AWAITING_SHIP") {
          and.push(awaitingShipInPaidWhere);
        }
      }
    }
  }

  if (input.search) {
    and.push(adminOrderSearchToPrismaWhere(input.search));
  }

  if (and.length === 0) return {};
  if (and.length === 1) return and[0]!;
  return { AND: and };
}

export async function loadAdminOrdersList(params: {
  from?: string;
  to?: string;
  status?: string;
  fulfillment?: string;
  queue?: string;
  searchBy?: string;
  q?: string;
}): Promise<
  | {
      ok: true;
      orders: AdminOrderListRow[];
      totalMatching: number;
      fulfillmentStats: { all: number; awaiting: number; inTransit: number; delivered: number };
      cancelRequestCount: number;
      listCapped: boolean;
    }
  | { ok: false }
> {
  try {
    const search = parseAdminOrdersListSearch(params.searchBy, params.q);
    const queue = params.queue === "cancelRequest" ? "cancelRequest" : undefined;
    const fulfillmentEffective = !queue && params.status === "PAID" ? params.fulfillment : undefined;

    const listWhere = buildAdminOrdersListWhere({
      from: params.from,
      to: params.to,
      status: queue ? undefined : params.status,
      fulfillment: fulfillmentEffective,
      queue,
      search,
    });

    const paidBase = buildAdminPaidDateBaseWhere(params.from, params.to);
    const needFulfillmentStats = queue !== "cancelRequest";

    const deliveredWhere = mergeOrderWhere(paidBase, { fulfillmentStatus: FulfillmentStatus.DELIVERED });
    const inTransitCountWhere = mergeOrderWhere(paidBase, {
      NOT: { fulfillmentStatus: FulfillmentStatus.DELIVERED },
      OR: [
        { fulfillmentStatus: FulfillmentStatus.IN_TRANSIT },
        nonEmptyTrackingWhere,
      ],
    });
    const awaitingCountWhere = mergeOrderWhere(paidBase, awaitingShipInPaidWhere);

    const [totalMatching, orders, cancelRequestCount, paidAll, awaitingCnt, inTransitCnt, deliveredCnt] =
      await Promise.all([
        prisma.order.count({ where: listWhere }),
        prisma.order.findMany({
          where: listWhere,
          select: adminOrdersListSelect,
          orderBy:
            queue === "cancelRequest"
              ? [{ customerCancelRequestedAt: "desc" }, { createdAt: "desc" }]
              : { createdAt: "desc" },
          take: ADMIN_ORDER_LIST_TAKE,
        }),
        prisma.order.count({ where: pendingCustomerCancelRequestWhere }),
        needFulfillmentStats ? prisma.order.count({ where: paidBase }) : Promise.resolve(0),
        needFulfillmentStats ? prisma.order.count({ where: awaitingCountWhere }) : Promise.resolve(0),
        needFulfillmentStats ? prisma.order.count({ where: inTransitCountWhere }) : Promise.resolve(0),
        needFulfillmentStats ? prisma.order.count({ where: deliveredWhere }) : Promise.resolve(0),
      ]);

    return {
      ok: true,
      orders,
      totalMatching,
      fulfillmentStats: {
        all: paidAll,
        awaiting: awaitingCnt,
        inTransit: inTransitCnt,
        delivered: deliveredCnt,
      },
      cancelRequestCount,
      listCapped: totalMatching > ADMIN_ORDER_LIST_TAKE,
    };
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

export type OrdersExportFilter = {
  from?: string;
  to?: string;
  /** `ALL`이면 결제 상태로는 제한하지 않음 */
  status: "ALL" | "PAID" | "PENDING" | "CANCELLED_REFUNDED";
  /** 결제완료 주문에만 적용. `ALL`이면 배송 단계로는 제한하지 않음 */
  fulfillment: "ALL" | "AWAITING_SHIP" | "IN_TRANSIT" | "DELIVERED";
  /** 정규화된 코드 — 레퍼럴·적용 공구·쿠폰 중 하나라도 일치 */
  inflowCode?: string | null;
  /**
   * 생략 시 일반·공구 구분 없음(기존 동작).
   * `general`: 공구 캠페인 할인이 적용되지 않은 주문(`appliedPromoCode` 없음).
   * `promo`: 공구 할인이 적용된 주문만.
   */
  scope?: "general" | "promo";
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

  if (filter.scope === "general") {
    andParts.push({ appliedPromoCode: null });
  } else if (filter.scope === "promo") {
    andParts.push({ appliedPromoCode: { not: null } });
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

/** 공구 할인이 적용된 주문에만 등장한 캠페인 코드 목록 */
export async function listDistinctAppliedPromoCodesFromOrders(): Promise<string[]> {
  const rows = await prisma.order.findMany({
    where: { appliedPromoCode: { not: null } },
    distinct: ["appliedPromoCode"],
    select: { appliedPromoCode: true },
  });
  const out = rows.map((r) => r.appliedPromoCode).filter((c): c is string => Boolean(c));
  return out.sort((a, b) => a.localeCompare(b));
}

/** 대시보드 등: 전체 스캔 없이 최근 주문만 */
export async function getRecentOrdersForAdmin(limit: number, dateQuery?: { from?: string; to?: string }) {
  const dateWhere = prismaOrderCreatedAtRange(dateQuery?.from, dateQuery?.to);
  return prisma.order.findMany({
    where: Object.keys(dateWhere).length ? (dateWhere as Prisma.OrderWhereInput) : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      customerName: true,
      phone: true,
      paymentStatus: true,
      fulfillmentStatus: true,
      trackingNumber: true,
      totalAmount: true,
      referralCode: true,
      appliedPromoCode: true,
      couponCode: true,
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

function carrierLabelFromCode(code: string) {
  return SWEET_TRACKER_CARRIER_OPTIONS.find((c) => c.code === code)?.label ?? code;
}

const registerShipmentItemSchema = z.object({
  orderNumber: z.string().min(1).max(40),
  trackingCarrierCode: z.string().min(1).max(8),
  trackingNumber: z.string().min(1).max(80),
});

/**
 * 목록에서 체크한 주문에 택배사·운송장을 등록하고 배송중(IN_TRANSIT)으로 전환.
 */
export async function registerOrderShipments(
  items: Array<z.infer<typeof registerShipmentItemSchema>>,
): Promise<{ registered: string[]; errors: string[] }> {
  const registered: string[] = [];
  const errors: string[] = [];

  for (const raw of items) {
    let parsed: z.infer<typeof registerShipmentItemSchema>;
    try {
      parsed = registerShipmentItemSchema.parse(raw);
    } catch {
      errors.push("입력값이 올바르지 않은 주문이 있습니다.");
      continue;
    }

    const orderNumber = parsed.orderNumber.trim();
    const trackingCarrierCode = parsed.trackingCarrierCode.trim();
    const trackingNumber = parsed.trackingNumber.trim();
    const carrier = carrierLabelFromCode(trackingCarrierCode);

    try {
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
        select: {
          paymentStatus: true,
          fulfillmentStatus: true,
          shippedAt: true,
        },
      });
      if (!existing) {
        errors.push(`${orderNumber}: 주문을 찾을 수 없습니다.`);
        continue;
      }
      if (existing.paymentStatus !== OrderStatus.PAID) {
        errors.push(`${orderNumber}: 결제완료 주문만 송장 등록할 수 있습니다.`);
        continue;
      }
      if (existing.fulfillmentStatus === FulfillmentStatus.DELIVERED) {
        errors.push(`${orderNumber}: 이미 배송완료된 주문입니다.`);
        continue;
      }

      await prisma.order.update({
        where: { orderNumber },
        data: {
          carrier,
          trackingNumber,
          trackingCarrierCode,
          fulfillmentStatus: FulfillmentStatus.IN_TRANSIT,
          shippedAt: existing.shippedAt ?? new Date(),
        },
      });
      registered.push(orderNumber);

      void syncOrderDeliveryFromSweetTracker(orderNumber, { ignoreInterval: true }).catch(() => null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "송장 등록 실패";
      errors.push(`${orderNumber}: ${message}`);
    }
  }

  return { registered, errors };
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
  const [all, pending, paid, cancelled, refunded, paidDelivered, paidInTransit, paidAwaitingShip, cancelRequestPending] =
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
      // 미처리 요청은 기간 필터와 무관하게 전체 카운트
      prisma.order.count({ where: pendingCustomerCancelRequestWhere }),
    ]);
  return {
    all,
    pending,
    paid,
    cancelled,
    refunded,
    paidAwaitingShip,
    paidInTransit,
    paidDelivered,
    cancelRequestPending,
  };
}

export type AdminSalesProductRow = {
  sku: string;
  name: string;
  quantity: number;
  revenue: number;
};

export type AdminSalesDailyRow = {
  day: string;
  revenue: number;
  orderCount: number;
};

export type AdminSalesSummary = {
  period: {
    paidOrderCount: number;
    paidRevenue: number;
    unitsSold: number;
    refundedOrderCount: number;
    refundedAmount: number;
  };
  lifetime: {
    paidOrderCount: number;
    paidRevenue: number;
  };
  products: AdminSalesProductRow[];
  daily: AdminSalesDailyRow[];
};

/** 결제완료(PAID) 기준 매출·상품 판매량. 기간은 주문 createdAt(KST 일 단위). */
export async function getAdminSalesSummary(dateQuery?: {
  from?: string;
  to?: string;
}): Promise<AdminSalesSummary> {
  const chartFrom =
    dateQuery?.from?.trim() ||
    (() => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - 29);
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
    })();
  const chartTo =
    dateQuery?.to?.trim() ||
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  const dateWhere = prismaOrderCreatedAtRange(dateQuery?.from, dateQuery?.to);
  const periodBase = (Object.keys(dateWhere).length ? dateWhere : {}) as Prisma.OrderWhereInput;
  const periodPaid: Prisma.OrderWhereInput = { ...periodBase, paymentStatus: OrderStatus.PAID };
  const periodRefunded: Prisma.OrderWhereInput = { ...periodBase, paymentStatus: OrderStatus.REFUNDED };
  const chartDateWhere = prismaOrderCreatedAtRange(chartFrom, chartTo);
  const chartPaid: Prisma.OrderWhereInput = {
    ...(Object.keys(chartDateWhere).length ? chartDateWhere : {}),
    paymentStatus: OrderStatus.PAID,
  };

  const [periodAgg, lifetimeAgg, refundAgg, items, chartOrders] = await Promise.all([
    prisma.order.aggregate({
      where: periodPaid,
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: OrderStatus.PAID },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: periodRefunded,
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.orderItem.findMany({
      where: { order: periodPaid },
      select: {
        sku: true,
        productNameSnapshot: true,
        quantity: true,
        unitPrice: true,
      },
    }),
    prisma.order.findMany({
      where: chartPaid,
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: "asc" },
      take: 5000,
    }),
  ]);

  const bySku = new Map<string, AdminSalesProductRow>();
  let unitsSold = 0;
  for (const item of items) {
    unitsSold += item.quantity;
    const key = item.sku || item.productNameSnapshot;
    const prev = bySku.get(key);
    const line = item.unitPrice * item.quantity;
    if (prev) {
      prev.quantity += item.quantity;
      prev.revenue += line;
    } else {
      bySku.set(key, {
        sku: item.sku,
        name: item.productNameSnapshot,
        quantity: item.quantity,
        revenue: line,
      });
    }
  }

  const products = [...bySku.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue);

  const dayFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const byDay = new Map<string, AdminSalesDailyRow>();
  for (const order of chartOrders) {
    const day = dayFmt.format(order.createdAt);
    const prev = byDay.get(day);
    if (prev) {
      prev.revenue += order.totalAmount;
      prev.orderCount += 1;
    } else {
      byDay.set(day, { day, revenue: order.totalAmount, orderCount: 1 });
    }
  }

  // 빈 날짜도 채워 그래프가 끊기지 않게
  const daily: AdminSalesDailyRow[] = [];
  const start = parseYmdParts(chartFrom);
  const end = parseYmdParts(chartTo);
  if (start && end) {
    const cursor = new Date(Date.UTC(start.y, start.mo - 1, start.d));
    const endUtc = new Date(Date.UTC(end.y, end.mo - 1, end.d));
    while (cursor <= endUtc) {
      const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}-${String(cursor.getUTCDate()).padStart(2, "0")}`;
      daily.push(byDay.get(key) ?? { day: key, revenue: 0, orderCount: 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      if (daily.length > 92) break;
    }
  } else {
    daily.push(...[...byDay.values()].sort((a, b) => a.day.localeCompare(b.day)));
  }

  return {
    period: {
      paidOrderCount: periodAgg._count._all,
      paidRevenue: periodAgg._sum.totalAmount ?? 0,
      unitsSold,
      refundedOrderCount: refundAgg._count._all,
      refundedAmount: refundAgg._sum.totalAmount ?? 0,
    },
    lifetime: {
      paidOrderCount: lifetimeAgg._count._all,
      paidRevenue: lifetimeAgg._sum.totalAmount ?? 0,
    },
    products,
    daily,
  };
}

function parseYmdParts(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  return { y: Number(m[1]), mo: Number(m[2]), d: Number(m[3]) };
}

export async function loadAdminSalesSummary(dateQuery?: { from?: string; to?: string }): Promise<
  | { ok: true; summary: AdminSalesSummary }
  | { ok: false }
> {
  try {
    const summary = await getAdminSalesSummary(dateQuery);
    return { ok: true, summary };
  } catch (error) {
    console.error("[orders] admin sales summary failed", error);
    return { ok: false };
  }
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
  const existing = await prisma.order.findUnique({
    where: { orderNumber },
    include: { orderItems: true },
  });
  if (!existing) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  }
  if (existing.paymentStatus === OrderStatus.REFUNDED) {
    return existing;
  }

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

/**
 * 관리자 주문 취소.
 * - PENDING: PG 없이 CANCELLED
 * - PAID: 토스 결제 취소 후 REFUNDED
 * - deductChangeOfMindFee: 발송 후 단순변심이면 배송비 6,000원 차감 부분취소
 */
export async function adminCancelOrder(
  orderNumber: string,
  options: { reason: string; deductChangeOfMindFee?: boolean },
): Promise<{ order: Awaited<ReturnType<typeof refundOrderPayment>>; alreadyDone: boolean }> {
  const reason = options.reason.trim().slice(0, 200);
  if (!reason) {
    throw new Error("취소 사유를 입력해 주세요.");
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { orderItems: true },
  });
  if (!order) {
    throw new Error("주문 정보를 찾을 수 없습니다.");
  }

  if (order.paymentStatus === OrderStatus.REFUNDED || order.paymentStatus === OrderStatus.CANCELLED) {
    return { order, alreadyDone: true };
  }

  if (order.paymentStatus === OrderStatus.PENDING) {
    const cancelled = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
        paymentFailureCode: "ADMIN_CANCEL",
        paymentFailureMessage: reason,
        fulfillmentStatus: null,
        deliveredAt: null,
        trackingCarrierCode: null,
        lastSweetTrackerPollAt: null,
        customerCancelRequestedAt: null,
        customerCancelReason: null,
        adminNote: [order.adminNote?.trim(), `[관리자 취소] ${reason}`].filter(Boolean).join("\n"),
      },
      include: { orderItems: true },
    });
    return { order: cancelled, alreadyDone: false };
  }

  if (order.paymentStatus !== OrderStatus.PAID) {
    throw new Error("이 주문 상태에서는 취소할 수 없습니다.");
  }

  const paymentKey = (order.paymentToken ?? order.paymentReference)?.trim();
  if (!paymentKey) {
    throw new Error("결제키(paymentKey)가 없어 토스 취소를 진행할 수 없습니다. 토스 대시보드에서 직접 취소 후 상태를 맞춰 주세요.");
  }

  const shipped = !isPaidOrderAwaitingShipment(order);
  const deductFee = Boolean(options.deductChangeOfMindFee) && shipped;
  const cancelAmount = deductFee ? refundAmountAfterChangeOfMindFee(order.totalAmount) : undefined;

  if (deductFee && (cancelAmount == null || cancelAmount <= 0)) {
    throw new Error(
      `결제금액이 단순변심 배송비(${CHANGE_OF_MIND_SHIPPING_FEE.toLocaleString("ko-KR")}원) 이하라 부분 환불을 진행할 수 없습니다.`,
    );
  }

  const cancelReason = deductFee
    ? `${reason} (단순변심 · 배송비 ${CHANGE_OF_MIND_SHIPPING_FEE.toLocaleString("ko-KR")}원 차감 · 환불 ${cancelAmount!.toLocaleString("ko-KR")}원)`
    : reason;

  const tossResult = await cancelTossPaymentOnServer({
    paymentKey,
    cancelReason,
    cancelAmount,
    idempotencyKey: deductFee
      ? `admin-cancel-fee-${order.orderNumber}`
      : `admin-cancel-${order.orderNumber}`,
  });

  const payload = JSON.stringify({
    source: "admin_cancel",
    reason: cancelReason,
    deductChangeOfMindFee: deductFee,
    cancelAmount: cancelAmount ?? order.totalAmount,
    shippingFeeDeducted: deductFee ? CHANGE_OF_MIND_SHIPPING_FEE : 0,
    cancelledAt: new Date().toISOString(),
    toss: tossResult,
  });

  const noteLine = deductFee
    ? `[관리자 결제취소·단순변심] ${reason} · 배송비 ${CHANGE_OF_MIND_SHIPPING_FEE.toLocaleString("ko-KR")}원 차감 · 환불 ${cancelAmount!.toLocaleString("ko-KR")}원`
    : `[관리자 결제취소] ${reason}`;

  const refunded = await prisma.order.update({
    where: { orderNumber },
    data: {
      paymentStatus: OrderStatus.REFUNDED,
      refundedAt: new Date(),
      paymentPayload: payload,
      fulfillmentStatus: null,
      deliveredAt: null,
      trackingCarrierCode: null,
      lastSweetTrackerPollAt: null,
      customerCancelRequestedAt: null,
      customerCancelReason: null,
      adminNote: [order.adminNote?.trim(), noteLine].filter(Boolean).join("\n"),
    },
    include: { orderItems: true },
  });

  return { order: refunded, alreadyDone: false };
}

/**
 * 관리자 주문 삭제(하드 삭제). OrderItem은 cascade.
 * 결제완료(PAID)는 환불·취소 후만 삭제 가능 — 실결제 건 실수 삭제 방지.
 */
export async function adminDeleteOrder(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { orderNumber: true, paymentStatus: true },
  });
  if (!order) {
    throw new Error("주문을 찾을 수 없습니다.");
  }
  if (order.paymentStatus === OrderStatus.PAID) {
    throw new Error("결제완료 주문은 먼저 결제 취소(환불)한 뒤 삭제할 수 있습니다.");
  }

  await prisma.order.delete({ where: { orderNumber } });
  return { orderNumber: order.orderNumber };
}

function digitsOnlyPhone(value: string) {
  return value.replace(/\D/g, "");
}

/** 한국 휴대폰 숫자만 정규화 (+82 → 0…, 하이픈/공백 제거) */
export function normalizeKoreanPhoneDigits(value: string) {
  let d = digitsOnlyPhone(value);
  if (d.startsWith("82") && d.length >= 11) {
    d = `0${d.slice(2)}`;
  }
  return d;
}

function phonesMatch(stored: string, input: string) {
  const a = normalizeKoreanPhoneDigits(stored);
  const b = normalizeKoreanPhoneDigits(input);
  if (a.length < 10 || b.length < 10) return false;
  return a === b || a.endsWith(b.slice(-10)) || b.endsWith(a.slice(-10));
}

function normalizeCustomerName(value: string) {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

function namesMatch(stored: string, input: string) {
  const a = normalizeCustomerName(stored);
  const b = normalizeCustomerName(input);
  return a.length >= 2 && b.length >= 2 && a === b;
}

export type CustomerOrderView = {
  orderNumber: string;
  createdAt: Date;
  paymentStatus: OrderStatus;
  fulfillmentLabel: string;
  awaitingShipment: boolean;
  /** 운송장 등록·배송중·배송완료 (발송 후) */
  hasShipped: boolean;
  totalAmount: number;
  customerName: string;
  phone: string;
  address: string;
  postalCode: string;
  items: Array<{ name: string; quantity: number; lineTotal: number }>;
  customerCancelRequestedAt: Date | null;
  customerCancelReason: string | null;
  /** 결제완료 + 발송 전 → 즉시 결제 취소 */
  canCancelNow: boolean;
  /** 결제완료 + 발송 후 → 환불 요청만 */
  canRequestRefund: boolean;
};

export type CustomerLookupResult = {
  orders: CustomerOrderView[];
  /** 이름·연락처는 맞지만 취소/환불 대상 결제완료 주문이 없음 */
  identityMatchedButNoActionable: boolean;
};

/** 고객 조회 화면에 노출할 주문: 결제완료이면서 취소 또는 환불 요청이 가능한 건만 */
function isCustomerLookupActionable(view: CustomerOrderView): boolean {
  if (view.paymentStatus !== OrderStatus.PAID) return false;
  return view.canCancelNow || view.canRequestRefund || Boolean(view.customerCancelRequestedAt);
}

function toCustomerOrderView(
  order: Prisma.OrderGetPayload<{ include: { orderItems: true } }>,
): CustomerOrderView {
  const awaitingShipment = isPaidOrderAwaitingShipment(order);
  const hasShipped = order.paymentStatus === OrderStatus.PAID && !awaitingShipment;
  // 고객 즉시 취소는 결제완료·발송 전만 (결제대기는 조회 목록에서 제외)
  const canCancelNow = order.paymentStatus === OrderStatus.PAID && awaitingShipment;
  const canRequestRefund = hasShipped && !order.customerCancelRequestedAt;

  return {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    paymentStatus: order.paymentStatus,
    fulfillmentLabel: adminFulfillmentLabel(order),
    awaitingShipment,
    hasShipped,
    totalAmount: order.totalAmount,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    postalCode: order.postalCode,
    items: order.orderItems.map((item) => ({
      name: item.productNameSnapshot,
      quantity: item.quantity,
      lineTotal: item.unitPrice * item.quantity,
    })),
    customerCancelRequestedAt: order.customerCancelRequestedAt,
    customerCancelReason: order.customerCancelReason,
    canCancelNow,
    canRequestRefund,
  };
}

function customerIdentityOk(
  order: { phone: string; customerName: string },
  phone: string,
  customerName: string,
) {
  return phonesMatch(order.phone, phone) && namesMatch(order.customerName, customerName);
}

/**
 * 비회원 주문 조회: 주문자 이름 + 연락처.
 * 취소·환불 목적 — 결제완료이면서 발송 전(즉시 취소) 또는 발송 후(환불 요청)만 반환.
 * 결제대기·이미 취소/환불된 과거 주문은 숨깁니다.
 */
export async function lookupCustomerOrdersByNameAndPhone(
  customerName: string,
  phone: string,
): Promise<CustomerLookupResult> {
  const name = customerName.trim();
  const phoneDigits = normalizeKoreanPhoneDigits(phone);
  if (normalizeCustomerName(name).length < 2 || phoneDigits.length < 10) {
    return { orders: [], identityMatchedButNoActionable: false };
  }

  const phoneTail = phoneDigits.slice(-10);
  const matched = await prisma.$queryRaw<Array<{ orderNumber: string }>>`
    SELECT "orderNumber"
    FROM "Order"
    WHERE
      right(
        CASE
          WHEN regexp_replace("phone", '[^0-9]', '', 'g') LIKE '82%'
            THEN '0' || substring(regexp_replace("phone", '[^0-9]', '', 'g') from 3)
          ELSE regexp_replace("phone", '[^0-9]', '', 'g')
        END,
        10
      ) = ${phoneTail}
      AND "paymentStatus" = 'PAID'
    ORDER BY "createdAt" DESC
    LIMIT 40
  `;

  if (matched.length === 0) {
    // 결제완료가 없어도 이름·연락처 일치 주문이 있는지(안내 문구용)
    const anyMatch = await prisma.$queryRaw<Array<{ orderNumber: string }>>`
      SELECT "orderNumber"
      FROM "Order"
      WHERE
        right(
          CASE
            WHEN regexp_replace("phone", '[^0-9]', '', 'g') LIKE '82%'
              THEN '0' || substring(regexp_replace("phone", '[^0-9]', '', 'g') from 3)
            ELSE regexp_replace("phone", '[^0-9]', '', 'g')
          END,
          10
        ) = ${phoneTail}
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;
    if (anyMatch.length === 0) {
      return { orders: [], identityMatchedButNoActionable: false };
    }
    const anyOrders = await prisma.order.findMany({
      where: { orderNumber: { in: anyMatch.map((row) => row.orderNumber) } },
      select: { customerName: true },
    });
    const identityMatched = anyOrders.some((order) => namesMatch(order.customerName, name));
    return { orders: [], identityMatchedButNoActionable: identityMatched };
  }

  const orders = await prisma.order.findMany({
    where: { orderNumber: { in: matched.map((row) => row.orderNumber) } },
    include: { orderItems: true },
    orderBy: { createdAt: "desc" },
  });

  const views = orders
    .filter((order) => namesMatch(order.customerName, name))
    .map(toCustomerOrderView)
    .filter(isCustomerLookupActionable);

  return {
    orders: views,
    identityMatchedButNoActionable: views.length === 0 && orders.some((o) => namesMatch(o.customerName, name)),
  };
}

/** 단일 주문 조회 (이름+연락처 검증). 취소·환불 대상이 아니면 null */
export async function lookupCustomerOrder(
  orderNumber: string,
  phone: string,
  customerName: string,
): Promise<CustomerOrderView | null> {
  const number = orderNumber.trim();
  const name = customerName.trim();
  if (!number || normalizeKoreanPhoneDigits(phone).length < 10 || normalizeCustomerName(name).length < 2) {
    return null;
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: number },
    include: { orderItems: true },
  });
  if (!order || !customerIdentityOk(order, phone, name)) return null;
  const view = toCustomerOrderView(order);
  if (!isCustomerLookupActionable(view)) return null;
  return view;
}

/**
 * 고객 즉시 취소.
 * - PAID + 발송 전 → 토스 취소 후 REFUNDED
 * (운송장 등록·배송중이면 환불 요청만 가능)
 */
export async function customerCancelOrder(
  orderNumber: string,
  phone: string,
  customerName: string,
  reason: string,
) {
  const view = await lookupCustomerOrder(orderNumber, phone, customerName);
  if (!view) {
    throw new Error("주문자 이름 또는 연락처가 올바르지 않습니다.");
  }
  if (!view.canCancelNow) {
    throw new Error(
      view.hasShipped
        ? "운송장이 등록되어 배송이 진행 중입니다. 즉시 취소는 불가하니 환불 요청을 남겨 주세요."
        : "지금은 즉시 취소할 수 없습니다. 환불 요청을 남겨 주세요.",
    );
  }

  const noteReason = reason.trim() || "고객 요청 취소";
  return adminCancelOrder(orderNumber, { reason: `[고객] ${noteReason}` });
}

/** 발송 후 등: 관리자 확인용 환불·취소 요청만 접수 */
export async function customerRequestCancelOrRefund(
  orderNumber: string,
  phone: string,
  customerName: string,
  reason: string,
  category: "change_of_mind" | "defect" = "change_of_mind",
) {
  const cleaned = reason.trim().slice(0, 300);
  if (!cleaned) {
    throw new Error("요청 사유를 입력해 주세요.");
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: orderNumber.trim() },
    include: { orderItems: true },
  });
  if (!order || !customerIdentityOk(order, phone, customerName)) {
    throw new Error("주문자 이름 또는 연락처가 올바르지 않습니다.");
  }
  if (order.paymentStatus !== OrderStatus.PAID) {
    throw new Error("결제완료 주문만 환불 요청이 가능합니다.");
  }
  if (isPaidOrderAwaitingShipment(order)) {
    throw new Error("발송 전 주문은 바로 결제 취소가 가능합니다. 환불 요청 대신 취소를 이용해 주세요.");
  }
  if (order.customerCancelRequestedAt) {
    return toCustomerOrderView(order);
  }

  const categoryLabel = category === "defect" ? "상품 하자·오배송" : "단순 변심";
  const feeNote =
    category === "change_of_mind"
      ? ` · 배송비 ${CHANGE_OF_MIND_SHIPPING_FEE.toLocaleString("ko-KR")}원 차감 예정`
      : " · 확인 후 전액 환불 검토";
  const storedReason = `[${categoryLabel}${feeNote}] ${cleaned}`;

  const updated = await prisma.order.update({
    where: { orderNumber: order.orderNumber },
    data: {
      customerCancelRequestedAt: new Date(),
      customerCancelReason: storedReason,
      adminNote: [order.adminNote?.trim(), `[고객 환불요청] ${storedReason}`].filter(Boolean).join("\n"),
    },
    include: { orderItems: true },
  });
  return toCustomerOrderView(updated);
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
