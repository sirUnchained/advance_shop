import { Schema, model } from "mongoose";

const sellerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactDetails: {
      phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      telegramID: {
        type: String,
        trim: true,
        required: false,
        unique: true,
      },
      instagramID: {
        type: String,
        trim: true,
        required: false,
        unique: true,
      },
    },
    cityID: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const SellerModel = model("sellers", sellerSchema);

export default SellerModel;
