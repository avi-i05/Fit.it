import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true
    },

    categorySlug: {
      type: String,
      required: true,
      unique: true
    },

    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const ProductCategory = mongoose.model("ProductCategory", categorySchema);
