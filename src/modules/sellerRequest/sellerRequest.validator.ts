import { Types } from "mongoose";
import * as yup from "yup";

const isValidObjectId = (value: any) => Types.ObjectId.isValid(value);

const createSellerRequestValidator = yup.object().shape({
  productId: yup
    .string()
    .required("Product ID is required")
    .test(
      "is-valid-objectid",
      "Product ID must be a valid ObjectId",
      isValidObjectId
    ),

  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1"),

  count: yup
    .number()
    .required("Stock is required")
    .integer("Stock must be an integer")
    .min(1, "Stock must be at least 1"),
});

const updateSellerRequestValidator = yup.object().shape({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["accept", "reject"]),

  adminComments: yup
    .string()
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export { createSellerRequestValidator, updateSellerRequestValidator };
