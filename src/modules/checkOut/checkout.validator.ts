import * as yup from "yup";

const createCheckoutValidator = yup.object({
  shippingAddress: yup.object({
    address: yup
      .string()
      .required("Address is required")
      .min(6)
      .max(1000, "Address cannot exceed 1000 characters"),

    location: yup.object().shape({
      lat: yup.number().required("Latitude is required").min(-90).max(90),
      lng: yup.number().required("Longitude is required").min(-180).max(180),
    }),

    cityId: yup.number().required("City is required").positive().integer(),
  }),
});

export { createCheckoutValidator };
