import { Types } from "mongoose";
import { Product } from "../product/product.model.js";
import { Category } from "../category/category.model.js";

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

export const createProduct = async (data: CreateProductData) => {
  const category = await Category.findById(data.categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  /*
   * TODO once Brand module exists: verify brandId the same way
   * we verify categoryId above. Skipped for now since there is
   * no Brand collection to check against yet.
   */

  const product = await Product.create({
    name: data.name,
    slug: data.slug,
    ...(data.description !== undefined && { description: data.description }),
    categoryId: new Types.ObjectId(data.categoryId),
    brandId: new Types.ObjectId(data.brandId),
    images: data.images ?? [],
    variants: data.variants,
    status: data.status ?? "active",
  });

  return product;
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

export const deleteProduct = async (productId: string) => {
  /*
   * Unlike Category, Product has no "children" concept to block on.
   * Later: check whether any pending Orders reference this product
   * before allowing a hard delete — for now, a plain delete is fine.
   */
  return Product.findByIdAndDelete(productId);
};
