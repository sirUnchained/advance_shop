import { Schema, model } from "mongoose";
import SellerModel from "./Seller.model";
import ProductModel from "./Product.model";

const addressSchema: Schema = new Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    postalCode: {
      type: String,
      // required: true,
    },
    location: {
      lat: {
        type: String,
        // required: true,
      },
      lin: {
        type: String,
        // required: true,
      },
    },
    address: {
      type: String,
      // required: true,
    },
    cityID: {
      type: Number,
      // required: true,
    },
  },
  {
    strict: true,
  }
);

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    roles: {
      type: [String],
      enum: ["admin", "user", "seller"],
      default: ["user"],
    },
    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("deleteOne", async function (next) {
  try {
    const user = this.getQuery();

    if (user.roles.includes("seller")) {
      await SellerModel.deleteMany({ user: user._id });
      await ProductModel.deleteMany({ "sellers.seller": user._id });
    }

    next();
  } catch (error) {
    console.log(error);
  }
});

const UserModel = model("users", UserSchema);

export default UserModel;
