import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true,
        enum: ["XS","S", "M", "L", "XL", "XXL"]

    },
    color: {
        type: String,
        required: true
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    images: {
        type: [String],
        default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
},{timestamps: true});


export const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);