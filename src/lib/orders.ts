import { FulfillmentStatus, OrderStatus, PaymentMethod, ProductStatus, type Prisma } from "@prisma/client";
import { z } from "zod";

import { prismaOrderCreatedAtRange } from "@/lib/admin-orders-date-filter";
import { prisma } from "@/lib/db";
import { computeOrderPricing, resolveAppliedPromoCampaign } from "@/lib/promo";
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
  adminNote: z.string().max(2000).optional().nullable(),
});

export async function updateOrderAdminFields(
  orderNumber: string,
  input: z.infer<typeof adminOrderUpdateSchema>,
) {
  const parsed = adminOrderUpdateSchema.parse(input);
  const carrier = parsed.carrier?.trim() || null;
  const trackingNumber = parsed.trackingNumber?.trim() || null;
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
      data: { carrier, trackingNumber, adminNote },
      include: { orderItems: true },
    });
  }

  if (existing.fulfillmentStatus === FulfillmentStatus.DELIVERED) {
    return prisma.order.update({
      where: { orderNumber },
      data: { carrier, trackingNumber, adminNote },
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

export async function getOrderStats(dateQuery?: { from?: string; to?: string }) {
  const dateWhere = prismaOrderCreatedAtRange(dateQuery?.from, dateQuery?.to);
  const base = (Object.keys(dateWhere).length ? dateWhere : {}) as Prisma.OrderWhereInput;
  const [all, pending, paid, cancelled, refunded] = await Promise.all([
    prisma.order.count({ where: base }),
    prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.PENDING } }),
    prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.PAID } }),
    prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.CANCELLED } }),
    prisma.order.count({ where: { ...base, paymentStatus: OrderStatus.REFUNDED } }),
  ]);
  return { all, pending, paid, cancelled, refunded };
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
