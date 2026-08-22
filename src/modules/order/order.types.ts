import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  productName: string; // snapshot — survives the product being renamed/deleted later
  sku: string;
  attributes: Record<string, string>;
  unitPrice: number; // snapshot — survives future price changes
  quantity: number;
  lineTotal: number;
}

export interface IShippingAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrder {
  userId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddressSnapshot;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}