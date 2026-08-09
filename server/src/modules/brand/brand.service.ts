import { Brand } from "./brand.model.js";
import { Product } from "../product/product.model.js";

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

export const createBrand = async (data: CreateBrandData) => {
  const brand = await Brand.create({
    name: data.name,
    slug: data.slug,
    ...(data.description !== undefined && { description: data.description }),
    ...(data.logo !== undefined && { logo: data.logo }),
    status: data.status ?? "active",
  });

  return brand;
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

export const updateBrand = async (
  brandId: string,
  data: UpdateBrandData,
) => {
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
