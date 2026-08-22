import { Coupon } from "./coupon.model.js";

interface CreateCouponData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxUses?: number;
  expiresAt?: string;
  status?: "active" | "inactive";
}

interface UpdateCouponData {
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  minOrderValue?: number;
  maxUses?: number;
  expiresAt?: string;
  status?: "active" | "inactive";
}

export const createCoupon = async (data: CreateCouponData) => {
  if (data.discountType === "percentage" && data.discountValue > 100) {
    throw new Error("A percentage discount cannot exceed 100");
  }

  return Coupon.create({
    code: data.code,
    discountType: data.discountType,
    discountValue: data.discountValue,
    ...(data.minOrderValue !== undefined && {
      minOrderValue: data.minOrderValue,
    }),
    ...(data.maxUses !== undefined && { maxUses: data.maxUses }),
    ...(data.expiresAt !== undefined && {
      expiresAt: new Date(data.expiresAt),
    }),
    status: data.status ?? "active",
  });
};

export const getCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 }).lean();
};

export const getCouponById = async (couponId: string) => {
  return Coupon.findById(couponId).lean();
};

export const updateCoupon = async (
  couponId: string,
  data: UpdateCouponData,
) => {
  if (data.discountType === "percentage" && (data.discountValue ?? 0) > 100) {
    throw new Error("A percentage discount cannot exceed 100");
  }

  const updateData = {
    ...data,
    ...(data.expiresAt !== undefined && {
      expiresAt: new Date(data.expiresAt),
    }),
  };

  return Coupon.findByIdAndUpdate(couponId, updateData, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteCoupon = async (couponId: string) => {
  return Coupon.findByIdAndDelete(couponId);
};

/*
 * Used later at checkout (Order module) — validates a coupon code
 * against an order's subtotal WITHOUT applying/incrementing it yet.
 * Kept here since a coupon's own rules (expiry, min order, max uses)
 * are Coupon's business logic, not Order's.
 */
export const validateCouponForOrder = async (
  code: string,
  orderSubtotal: number,
) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || coupon.status !== "active") {
    throw new Error("Invalid or inactive coupon code");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error("This coupon has expired");
  }

  if (coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) {
    throw new Error("This coupon has reached its usage limit");
  }

  if (
    coupon.minOrderValue !== undefined &&
    orderSubtotal < coupon.minOrderValue
  ) {
    throw new Error(
      `This coupon requires a minimum order of ${coupon.minOrderValue}`,
    );
  }

  return coupon;
};