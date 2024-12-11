import * as yup from "yup";
import { isValidObjectId } from "mongoose";

const addToCartValidator = yup.object({
  productId: yup
    .string()
    .required("Product ID is required")
    .test("is-valid-object-id", "Invalid product ID", (value) =>
      isValidObjectId(value)
    ),
  sellerId: yup
    .string()
    .required("Seller ID is required")
    .test("is-valid-object-id", "Invalid seller ID", (value) =>
      isValidObjectId(value)
    ),
  quantity: yup.number().required("Quantity is required").positive().integer(),
});

const removeFromCartValidator = yup.object({
  productId: yup
    .string()
    .required("Product ID is required")
    .test("is-valid-object-id", "Invalid product ID", (value) =>
      isValidObjectId(value)
    ),
  sellerId: yup
    .string()
    .required("Seller ID is required")
    .test("is-valid-object-id", "Invalid seller ID", (value) =>
      isValidObjectId(value)
    ),
});

export { addToCartValidator, removeFromCartValidator };
