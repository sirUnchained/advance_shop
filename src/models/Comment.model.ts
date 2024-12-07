import { model, Schema } from "mongoose";

const replySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mainSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    replies: {
      type: [replySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("comments", mainSchema);

export default CommentModel;
