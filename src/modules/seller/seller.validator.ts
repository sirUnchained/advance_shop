import * as yup from "yup";

const createSellerValidator = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(255, "Name cannot exceed 255 characters"),

  contactDetails: yup.object().shape({
    phone: yup.string().required("Phone is required").trim(),
    telegramID: yup.string().trim(),
    instagramID: yup.string().trim(),
  }),

  cityID: yup.number().required("City is required").positive().integer(),
});

const updateSellerValidator = yup.object().shape({
  name: yup.string().max(255, "Name cannot exceed 255 characters"),

  contactDetails: yup.object().shape({
    phone: yup.string().trim(),
    telegramID: yup.string().trim(),
    instagramID: yup.string().trim(),
  }),

  cityID: yup.number().positive().integer(),
});

export { createSellerValidator, updateSellerValidator };
