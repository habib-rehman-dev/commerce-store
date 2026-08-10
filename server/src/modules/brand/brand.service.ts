import { Brand } from "./brand.model.js";
import { Product } from "../product/product.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../config/cloudinary.js";
import { AppError } from "../../utils/AppError.js";

interface CreateBrandData {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status?: "active" | "inactive";
}

interface UpdateBrandData {
  name?: string;
  slug?: string;
  description?: string;
  logo?: string;
  status?: "active" | "inactive";
}

export const createBrand = async (
  data: CreateBrandData,
  fileBuffer?: Buffer,
) => {
  let uploadResult: { url: string; publicId: string } | null = null;

  // 1. Upload logo to Cloudinary if file was attached
  if (fileBuffer) {
    uploadResult = await uploadToCloudinary(
      fileBuffer,
      "e-commerce_store/brands",
    );
  }

  // 2. Save brand to database with automatic Cloudinary rollback
  try {
    const brand = await Brand.create({
      name: data.name,
      slug: data.slug,
      ...(data.description !== undefined && { description: data.description }),
      logo: uploadResult?.url || data.logo || "",
      logoPublicId: uploadResult?.publicId || "",
      status: data.status ?? "active",
    });

    return brand;
  } catch (error) {
    // If saving to DB fails, remove the newly uploaded image from Cloudinary
    if (uploadResult?.publicId) {
      await deleteFromCloudinary(uploadResult.publicId);
    }
    throw error;
  }
};
export const getBrands = async () => {
  return Brand.find().sort({ name: 1 }).lean();
};

export const getBrandById = async (brandId: string) => {
  return Brand.findById(brandId).lean();
};

export const getBrandBySlug = async (slug: string) => {
  return Brand.findOne({ slug }).lean();
};

export const updateBrand = async (brandId: string, data: UpdateBrandData) => {
  return Brand.findByIdAndUpdate(brandId, data, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteBrand = async (brandId: string) => {
  /*
   * Unlike our earlier Category TODO, we CAN check this now
   * since Product already exists — a brand shouldn't disappear
   * while products still reference it (same orphaned-reference
   * problem we discussed for Category deletion).
   */
  const productCount = await Product.countDocuments({ brandId });

  if (productCount > 0) {
    throw new Error("Cannot delete a brand that has products assigned to it");
  }

  return Brand.findByIdAndDelete(brandId);
};
