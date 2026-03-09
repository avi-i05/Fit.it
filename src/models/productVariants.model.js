import mongoose from "mongoose";
import { Product } from "./product.model.js";
import slugify from "slugify";

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    color: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    audience: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);


productVariantSchema.pre("validate", async function () {

  if (!this.sku) {

    const product = await Product.findById(this.product);

    const baseSku = slugify(
      `${product.slug}-${this.size}-${this.color}-${this.audience}`,
      { lower: true, strict: true }
    );

    let sku = baseSku;
    let count = 1;

    const ProductVariant = mongoose.model("ProductVariant");

    while (await ProductVariant.findOne({ sku })) {
      sku = `${baseSku}-${count++}`;
    }

    this.sku = sku;
  }

  
});
export const ProductVariant = mongoose.model(
  "ProductVariant",
  productVariantSchema
);
