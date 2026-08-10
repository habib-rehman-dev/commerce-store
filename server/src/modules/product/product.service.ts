import { Types } from "mongoose";
import { Product } from "./product.model.js";
import { Category } from "../category/category.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../config/cloudinary.js";
import { Brand } from "../brand/brand.model.js";

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
  files?: Express.Multer.File[],
) => {
  // 1. Fetch current product state
  const product = await Product.findById(productId);
  if (!product) {
    return null;
  }

  // 2. Validate Category or Brand if provided
  if (data.categoryId) {
    const category = await Category.findById(data.categoryId);
    if (!category) throw new Error("Category not found");
  }

  if (data.brandId) {
    const brand = await Brand.findById(data.brandId);
    if (!brand) throw new Error("Brand not found");
  }

  // 3. Upload new images if attached
  let newUploadResults: { url: string; publicId: string }[] = [];
  if (files && files.length > 0) {
    newUploadResults = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, "e-commerce_store/products")
      )
    );
  }

  // 4. Build update object
  const updateData: Record<string, any> = { ...data };

  if (data.categoryId) {
    updateData.categoryId = new Types.ObjectId(data.categoryId);
  }
  if (data.brandId) {
    updateData.brandId = new Types.ObjectId(data.brandId);
  }

  if (newUploadResults.length > 0) {
    updateData.images = newUploadResults.map((r) => r.url);
    updateData.imagePublicIds = newUploadResults.map((r) => r.publicId);
  }

  // 5. Update DB & handle Cloudinary cleanup
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    // Delete old images from Cloudinary only after successful DB update
    if (
      newUploadResults.length > 0 &&
      product.imagePublicIds &&
      product.imagePublicIds.length > 0
    ) {
      await Promise.all(
        product.imagePublicIds.map((publicId) => deleteFromCloudinary(publicId))
      );
    }

    return updatedProduct;
  } catch (error) {
    // Rollback: delete newly uploaded images if DB update failed
    if (newUploadResults.length > 0) {
      await Promise.all(
        newUploadResults.map((r) => deleteFromCloudinary(r.publicId))
      );
    }
    throw error;
  }
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