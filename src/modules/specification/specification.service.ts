import { SpecificationDefinition } from "./specification.model.js";
import { Category } from "../category/category.model.js";

interface CreateSpecificationData {
  name: string;
  categoryId: string;
  values: string[];
  status?: "active" | "inactive";
}

interface UpdateSpecificationData {
  name?: string;
  values?: string[];
  status?: "active" | "inactive";
}

export const createSpecification = async (data: CreateSpecificationData) => {
  const category = await Category.findById(data.categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  // Friendly duplicate check — the unique index in the model is the
  // real safety net, but this gives a clearer error message first.
  const existing = await SpecificationDefinition.findOne({
    categoryId: data.categoryId,
    name: data.name,
  });

  if (existing) {
    throw new Error(
      "A specification with this name already exists for this category",
    );
  }

  return SpecificationDefinition.create({
    name: data.name,
    categoryId: data.categoryId,
    values: data.values,
    status: data.status ?? "active",
  });
};

export const getSpecificationsByCategory = async (categoryId: string) => {
  return SpecificationDefinition.find({
    categoryId,
    status: "active",
  })
    .sort({ name: 1 })
    .lean();
};

export const getSpecificationById = async (specificationId: string) => {
  return SpecificationDefinition.findById(specificationId).lean();
};

export const updateSpecification = async (
  specificationId: string,
  data: UpdateSpecificationData,
) => {
  return SpecificationDefinition.findByIdAndUpdate(specificationId, data, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteSpecification = async (specificationId: string) => {
  /*
   * TODO once Product references specs: block deletion if any
   * product variant currently uses this specification. Skipped
   * for now since Product doesn't reference specs yet.
   */
  return SpecificationDefinition.findByIdAndDelete(specificationId);
};