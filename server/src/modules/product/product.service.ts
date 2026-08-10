import { Types } from "mongoose";
import { Product } from "./product.model.js";
import { Category } from "../category/category.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../config/cloudinary.js";

interface ProductVariantInput {
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  discountPrice?: number;
  stock: number;
  images?: string[];
}

interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  brandId: string;
  images?: string[];
  variants: ProductVariantInput[];
  status?: "active" | "inactive";
}

interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  images?: string[];
  variants?: ProductVariantInput[];
  status?: "active" | "inactive";
}



export const createProduct = async (
  data: CreateProductData,
  files?: Express.Multer.File[]
) => {
  let uploadResults: { url: string; publicId: string }[] = [];

  if (files && files.length > 0) {
    uploadResults = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, "e-commerce_store/products")
      )
    );
  }

  try {
    const product = await Product.create({
      name: data.name,
      slug: data.slug,
      ...(data.description !== undefined && { description: data.description }),
      categoryId: new Types.ObjectId(data.categoryId),
      brandId: new Types.ObjectId(data.brandId),
      images: uploadResults.map((r) => r.url),
      imagePublicIds: uploadResults.map((r) => r.publicId), // Store public IDs
      variants: data.variants,
      status: data.status ?? "active",
    });

    return product;
  } catch (error) {
    if (uploadResults.length > 0) {
      await Promise.all(
        uploadResults.map((item) => deleteFromCloudinary(item.publicId))
      );
    }
    throw error;
  }
};

export const getProducts = async (filters: {
  categoryId?: string;
  brandId?: string;
  status?: "active" | "inactive";
}) => {
  const query: Record<string, unknown> = {};

  if (filters.categoryId) query.categoryId = filters.categoryId;
  if (filters.brandId) query.brandId = filters.brandId;
  if (filters.status) query.status = filters.status;

  return Product.find(query).sort({ createdAt: -1 }).lean();
};

export const getProductById = async (productId: string) => {
  return Product.findById(productId)
    .populate("categoryId", "name slug")
    .lean();
};

export const getProductBySlug = async (slug: string) => {
  return Product.findOne({ slug }).populate("categoryId", "name slug").lean();
};

export const updateProduct = async (
  productId: string,
  data: UpdateProductData,
) => {
  if (data.categoryId) {
    const category = await Category.findById(data.categoryId);

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const updateData = {
    ...data,
    ...(data.categoryId !== undefined && {
      categoryId: new Types.ObjectId(data.categoryId),
    }),
    ...(data.brandId !== undefined && {
      brandId: new Types.ObjectId(data.brandId),
    }),
  };

  return Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteProduct = async (id: string) => {
  // 1. Fetch product to access imagePublicIds
  const product = await Product.findById(id);

  if (!product) {
    return null;
  }

  // 2. Delete all uploaded images from Cloudinary concurrently
  if (product.imagePublicIds && product.imagePublicIds.length > 0) {
    await Promise.all(
      product.imagePublicIds.map((publicId) => deleteFromCloudinary(publicId))
    );
  }

  // 3. Delete product document from MongoDB
  await product.deleteOne();

  return product;
};