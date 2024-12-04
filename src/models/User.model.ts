import { Schema, model } from "mongoose";

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

const UserModel = model("users", UserSchema);

export default UserModel;
