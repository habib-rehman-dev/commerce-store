import { Types } from "mongoose";
import { Cart } from "./cart.model.js";
import { Product } from "../product/product.model.js";
import { type IProductVariant } from "../product/product.types.js";

type VariantWithId = IProductVariant & { _id: Types.ObjectId };

const getOrCreateCart = async (userId: string) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return cart;
};

const findVariant = (
  variants: VariantWithId[],
  variantId: string,
): VariantWithId | undefined =>
  variants.find((v) => v._id.toString() === variantId);

export const addItemToCart = async (
  userId: string,
  input: { productId: string; variantId: string; quantity: number },
) => {
  const product = await Product.findById(input.productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const variant = findVariant(
    product.variants as unknown as VariantWithId[],
    input.variantId,
  );

  if (!variant) {
    throw new Error("Variant not found on this product");
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) => item.variantId.toString() === input.variantId,
  );

  const newQuantity = (existingItem?.quantity ?? 0) + input.quantity;

  if (newQuantity > variant.stock) {
    throw new Error(`Only ${variant.stock} units available in stock`);
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      productId: new Types.ObjectId(input.productId),
      variantId: new Types.ObjectId(input.variantId),
      quantity: input.quantity,
    });
  }

  await cart.save();
  return cart;
};

export const updateCartItemQuantity = async (
  userId: string,
  variantId: string,
  quantity: number,
) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find((i) => i.variantId.toString() === variantId);

  if (!item) {
    throw new Error("Item not found in cart");
  }

  const product = await Product.findById(item.productId);
  const variant = product
    ? findVariant(product.variants as unknown as VariantWithId[], variantId)
    : undefined;

  if (variant && quantity > variant.stock) {
    throw new Error(`Only ${variant.stock} units available in stock`);
  }

  item.quantity = quantity;
  await cart.save();
  return cart;
};

export const removeCartItem = async (userId: string, variantId: string) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (i) => i.variantId.toString() !== variantId,
  ) as typeof cart.items;

  await cart.save();
  return cart;
};

export const clearCart = async (userId: string) => {
  return Cart.findOneAndUpdate(
    { userId },
    { items: [] },
    { new: true, upsert: true },
  );
};

/*
 * This is the "cart view" the frontend actually renders — it enriches
 * each stored { productId, variantId, quantity } with the LIVE product
 * name, price, and image, computed at read time. Unlike Order/OrderItem
 * (which will snapshot price at purchase time), Cart intentionally
 * always reflects current pricing.
 */
export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId })
    .populate("items.productId", "name slug images variants status")
    .lean();

  if (!cart) {
    return { userId, items: [], subtotal: 0 };
  }

  const enrichedItems = cart.items.map((item) => {
    const product = item.productId as unknown as {
      _id: Types.ObjectId;
      name: string;
      slug: string;
      variants: VariantWithId[];
    };

    const variant = findVariant(
      product?.variants ?? [],
      item.variantId.toString(),
    );

    const unitPrice = variant?.discountPrice ?? variant?.price ?? 0;

    return {
      productId: product?._id,
      productName: product?.name,
      productSlug: product?.slug,
      variantId: item.variantId,
      sku: variant?.sku,
      attributes: variant?.attributes,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
    };
  });

  const subtotal = enrichedItems.reduce((sum, i) => sum + i.lineTotal, 0);

  return { userId, items: enrichedItems, subtotal };
};