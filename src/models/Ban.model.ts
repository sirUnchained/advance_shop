import { Schema, model } from "mongoose";

const schema: Schema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BannedModel = model("bans", schema);

export default BannedModel;
