import { model, Schema } from "mongoose";

const schema: Schema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "sellers",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "products",
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
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    adminComment: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const sellerRequestModel = model("sellerRequests", schema);

export default sellerRequestModel;
