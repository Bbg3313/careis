import { OrderStatus, PaymentMethod } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
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
    where: { slug: { in: normalizedItems.map((item) => item.productSlug) } },
  });

  if (products.length !== normalizedItems.length) {
    throw new Error("선택한 상품 정보를 일부 찾을 수 없습니다.");
  }

  const referralCode = sanitizeReferralCode(parsed.referralCode);
  const totalAmount = normalizedItems.reduce((sum, item) => {
    const product = products.find((entry) => entry.slug === item.productSlug);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  return prisma.order.create({
    data: {
      orderNumber: createOrderNumber(),
      customerName: parsed.customerName,
      phone: parsed.phone,
      postalCode: parsed.postalCode,
      address: parsed.address,
      memo: parsed.memo || null,
      couponCode: parsed.couponCode || null,
      paymentMethod: parsed.paymentMethod,
      paymentStatus: OrderStatus.PENDING,
      referralCode,
      totalAmount,
      orderItems: {
        create: normalizedItems.map((item) => {
          const product = products.find((entry) => entry.slug === item.productSlug);

          if (!product) {
            throw new Error("선택한 상품 정보를 찾을 수 없습니다.");
          }

          return {
            productId: product.id,
            sku: product.sku,
            productNameSnapshot: product.name,
            quantity: item.quantity,
            unitPrice: product.price,
          };
        }),
      },
    },
    include: {
      orderItems: true,
    },
  });
}

export async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
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
