import { model, Schema } from "mongoose";

const orderItemSchema = new Schema({
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
  quantity: {
    type: Schema.Types.ObjectId,
    ref: "sellers",
    required: true,
  },
  priceAtTimeOfAdding: {
    type: Number,
    required: true,
  },
});

const mainSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: {
    type: [orderItemSchema],
  },
  shippingAddress: {
    postalCode: {
      type: String,
      trim: true,
      required: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    cityID: {
      type: Number,
      required: true,
    },
  },
  postTrackingCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PROCESSING", "SIPPED", "DELIVERED"],
    default: "PROCESSING",
  },
  authority: {
    type: String,
    required: true,
    unique: true,
  },
});

const OrderModel = model("orders", mainSchema);

export default OrderModel;
