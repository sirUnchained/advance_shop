import { Schema, model } from "mongoose";

const schema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    default: null,
  },
  description: {
    type: String,
    trim: true,
  },
  icon: {
    type: {
      filename: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  filters: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        enum: ["radio", "selectbox"],
        required: true,
      },
      options: {
        type: [String],
        default: undefined,
        validate: {
          validator: (options: []) => Array.isArray(options),
        },
      },
      min: Number,
      max: Number,
    },
  ],
});

const SubCategoryModel = model("sub_categories", schema);

export default SubCategoryModel;
