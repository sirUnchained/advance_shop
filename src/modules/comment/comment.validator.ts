import { isValidObjectId } from "mongoose";
import * as yup from "yup";

const createCommentValidator = yup.object().shape({
  product: yup
    .string()
    .required("Product ID is required")
    .test("is-valid-object-id", "Invalid product ID", (value) =>
      isValidObjectId(value)
    ),

  rating: yup.number().required("Rating is required").min(1).max(5),
  content: yup
    .string()
    .max(1000, "Comment content cannot exceed 1000 characters")
    .required("content is required."),
});

const updateCommentValidator = yup.object().shape({
  content: yup
    .string()
    .max(1000, "Comment content cannot exceed 1000 characters")
    .required("content is required."),

  rating: yup.number().min(1).max(5),
});

const addReplyValidator = yup.object().shape({
  content: yup
    .string()
    .max(1000, "Reply content cannot exceed 1000 characters")
    .required("Reply content is required"),
});

const updateReplyValidator = yup.object().shape({
  content: yup
    .string()
    .max(1000, "Reply content cannot exceed 1000 characters")
    .required("content is required."),
});

export {
  createCommentValidator,
  updateCommentValidator,
  addReplyValidator,
  updateReplyValidator,
};
