import * as yup from "yup";

const sendOtpValidator = yup.object({
  phone: yup
    .string()
    .matches(
      /((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g,
      "phone number is not valid."
    )
    .required("phone number is required."),
});

const otpValidator = yup.object({
  phone: yup
    .string()
    .matches(
      /((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g,
      "phone number is not valid."
    )
    .required("phone number is required."),

  otp: yup
    .string()
    .matches(/^[0-9]+$/g, "otp code is not valid.")
    .required("otp is required."),

  isSeller: yup.boolean().required("isSeller is required."),
});

export { sendOtpValidator, otpValidator };
