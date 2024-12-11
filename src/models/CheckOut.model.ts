import { model, Schema } from "mongoose";

const itemSchema = new Schema({
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
    required: true,
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
    items: [itemSchema],
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
        trim: true,
        required: true,
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
    authority: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 24 * 60 * 60 * 1000,
    },
  },
  {
    timestamps: true,
  }
);

mainSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    return total + item.price * item.count;
  }, 0);
});

const CheckOutModel = model("chek_outs", mainSchema);

export default CheckOutModel;
