import { model, Schema } from "mongoose";

const ItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "sellers",
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const mainSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [ItemSchema],
  },
  {
    timestamps: true,
  }
);

mainSchema.virtual("totalPrice").get(async function () {
  return this.items.reduce((total, nextItem) => {
    return total + nextItem.price * nextItem.count;
  }, 0);
});

const CartModel = model("carts", mainSchema);

export default CartModel;
