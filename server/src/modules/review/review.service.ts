import { Types } from "mongoose";
import { Review } from "./review.model.js";
import { Product } from "../product/product.model.js";
import { Order } from "../order/order.model.js";

interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

export const createReview = async (userId: string, data: CreateReviewData) => {
  const product = await Product.findById(data.productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Friendly duplicate check — the unique index in the model is the
  // real safety net, but this gives a clearer error message first.
  const existing = await Review.findOne({ userId, productId: data.productId });

  if (existing) {
    throw new Error("You have already reviewed this product");
  }

  // "Verified purchase" = this user has a PAID order containing this
  // product. We check paymentStatus, not delivery status, since that's
  // a fact we know immediately rather than one that depends on an
  // admin manually marking the order delivered.
  const hasPaidOrder = await Order.exists({
    userId,
    paymentStatus: "paid",
    "items.productId": data.productId,
  });

  return Review.create({
    userId,
    productId: data.productId,
    rating: data.rating,
    ...(data.title !== undefined && { title: data.title }),
    comment: data.comment,
    isVerifiedPurchase: Boolean(hasPaidOrder),
  });
};

export const getReviewsByProduct = async (productId: string) => {
  return Review.find({ productId }).sort({ createdAt: -1 }).lean();
};

// Aggregation: average rating + total count for a product's rating summary
export const getProductRatingSummary = async (productId: string) => {
  const [summary] = await Review.aggregate([
    { $match: { productId: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return {
    averageRating: summary?.averageRating ?? 0,
    totalReviews: summary?.totalReviews ?? 0,
  };
};

export const getReviewById = async (reviewId: string) => {
  return Review.findById(reviewId).lean();
};

export const updateReview = async (
  userId: string,
  reviewId: string,
  data: UpdateReviewData,
) => {
  return Review.findOneAndUpdate({ _id: reviewId, userId }, data, {
    new: true,
    runValidators: true,
  }).lean();
};

// Customer deleting their OWN review
export const deleteOwnReview = async (userId: string, reviewId: string) => {
  return Review.findOneAndDelete({ _id: reviewId, userId });
};

// Admin moderation — can delete ANY review, no ownership check
export const adminDeleteReview = async (reviewId: string) => {
  return Review.findByIdAndDelete(reviewId);
};