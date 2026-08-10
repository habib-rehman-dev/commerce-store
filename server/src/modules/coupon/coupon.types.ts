export interface ICoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}