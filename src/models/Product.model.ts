import { Schema, model } from "mongoose";
import NoteModel from "./Note.model";
import SellerModel from "./Seller.model";
import CommentModel from "./Comment.model";
import CartModel from "./Cart.model";

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

mainSchema.pre("deleteOne", async function (next) {
  try {
    const product = this.getQuery();
    await NoteModel.deleteMany({ product: product._id });
    await CommentModel.deleteMany({ product: product._id });
    await CartModel.deleteMany({
      items: {
        product: product._id,
      },
    });
    next();
  } catch (error) {
    console.log(error);
  }
});

mainSchema.pre("deleteMany", async function (next) {
  try {
    const product = this.getQuery()["_id"];

    if (!Array.isArray(product)) {
      await NoteModel.deleteMany({ product });
      await CommentModel.deleteMany({ product });
      await CartModel.deleteMany({
        items: {
          product,
        },
      });
    } else {
      await NoteModel.deleteMany({ product: { $in: product } });
      await CommentModel.deleteMany({ product: { $in: product } });
      await CartModel.deleteMany({
        items: {
          product: { $in: product },
        },
      });
    }

    next();
  } catch (error) {
    console.log(error);
  }
});

const ProductModel = model("products", mainSchema);

export default ProductModel;
