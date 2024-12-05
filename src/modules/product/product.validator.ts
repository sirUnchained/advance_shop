import { isValidObjectId } from "mongoose";
import * as yup from "yup";

const createProductValidator = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name cannot exceed 100 characters"),

  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),

  description: yup
    .string()
    .required("Product description is required")
    .max(1000, "Product description cannot exceed 1000 characters"),

  subSubCategory: yup
    .string()
    .required("SubCategory ID is required")
    .test(
      "is-valid-objectid",
      "SubCategory ID must be a valid ObjectId",
      isValidObjectId
    ),

  sellers: yup.array().of(
    yup.object().shape({
      id: yup
        .string()
        .required("Seller ID is required")
        .test(
          "is-valid-objectid",
          "Seller ID must be a valid ObjectId",
          isValidObjectId
        ),
      price: yup
        .number()
        .required("Price is required")
        .positive("Price must be a positive number"),
      count: yup
        .number()
        .required("Stock is required")
        .min(0, "Stock must be a non-negative number"),
    })
  ),

  customFilters: yup
    .object()
    .test(
      "customFieldsCheck",
      "customFields must be an object with key-value pairs",
      (value) => value === undefined || typeof value === "object"
    ),

  filterValues: yup
    .object()
    .test(
      "filterValuesCheck",
      "filterValues must be an object with key-value pairs",
      (value) => value === undefined || typeof value === "object"
    ),
});

const updateProductValidator = yup.object().shape({
  name: yup
    .string()
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name cannot exceed 100 characters"),

  slug: yup
    .string()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),

  description: yup
    .string()
    .max(1000, "Product description cannot exceed 1000 characters"),

  subSubCategory: yup
    .string()
    .test(
      "is-valid-objectid",
      "SubCategory ID must be a valid ObjectId",
      (value) => value === null || value === undefined || isValidObjectId(value)
    ),

  sellers: yup.array().of(
    yup.object().shape({
      id: yup
        .string()
        .required("Seller ID is required")
        .test(
          "is-valid-objectid",
          "Seller ID must be a valid ObjectId",
          isValidObjectId
        ),
      price: yup
        .number()
        .required("Price is required")
        .positive("Price must be a positive number"),
      count: yup
        .number()
        .required("Stock is required")
        .min(0, "Stock must be a non-negative number"),
    })
  ),

  customFields: yup
    .object()
    .test(
      "customFieldsCheck",
      "customFields must be an object with key-value pairs",
      (value) => value === undefined || typeof value === "object"
    ),

  filterValues: yup
    .object()
    .test(
      "filterValuesCheck",
      "filterValues must be an object with key-value pairs",
      (value) => value === undefined || typeof value === "object"
    ),
});

export { createProductValidator, updateProductValidator };
