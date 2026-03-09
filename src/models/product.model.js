import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import slugify from "slugify";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    highlights: [
      {
        sectionTitle: {
          type: String,
          required: true
        },

        type: {
          type: String,
          enum: ["list", "text", "specs"],
          required: true
        },

        content: Schema.Types.Mixed
      }
    ],
    productSeller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    productCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate);

productSchema.pre("validate", async function () {

  if (!this.slug && this.productName) {
    let baseSlug = slugify(this.productName, {
      lower: true,
      strict: true
    });

    let slug = baseSlug;

    const Product = mongoose.model("Product");

    let count = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

});

export const Product = mongoose.model("Product", productSchema);
