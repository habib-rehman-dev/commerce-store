import { Schema, model } from "mongoose";
import { type ISpecificationDefinition } from "./specification.types.js";

const specificationDefinitionSchema = new Schema<ISpecificationDefinition>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    values: {
      type: [String],
      required: true,
      validate: {
        validator: (values: string[]) => values.length > 0,
        message: "A specification needs at least one allowed value",
      },
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// "Give me all specs for this category" is the main query pattern
specificationDefinitionSchema.index({ categoryId: 1, status: 1 });

// Enforces "no duplicate spec name within the same category" at the DB level too
specificationDefinitionSchema.index(
  { categoryId: 1, name: 1 },
  { unique: true },
);

export const SpecificationDefinition = model<ISpecificationDefinition>(
  "SpecificationDefinition",
  specificationDefinitionSchema,
);