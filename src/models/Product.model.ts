import { Schema, model } from "mongoose";

const sellerSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mainSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subSubCategory: {
      type: Schema.Types.ObjectId,
      ref: "sub_categories",
      required: true,
    },
    images: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      default: null,
    },
    sellers: {
      type: [sellerSchema],
      default: [],
    },
    filterValues: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    customFilters: {
      type: Map,
      of: String,
      required: true,
    },
    shortIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = model("products", mainSchema);

export default ProductModel;
