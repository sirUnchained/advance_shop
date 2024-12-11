import axios from "axios";
import configs from "../configENV";
const zarinpal = axios.create({
  baseURL: `${configs.zarinpal.baseUrl}`,
});

const createPayment = async (
  amountInRial: Number,
  description: String,
  mobile: String
) => {
  try {
    const response = await zarinpal.post("/request.json", {
      merchant_id: configs.zarinpal.merchantId,
      callback_url: configs.zarinpal.paymantCallbackUrl,
      amount: amountInRial,
      description,
      metadata: {
        mobile,
      },
    });

    const data = response.data.data;

    return {
      authority: data.authority,
      paymentUrl: configs.zarinpal.paymentBaseUrl + data.authority,
    };
  } catch (error) {
    console.log(error);
  }
};

const verifyPayment = async (amountInRial: String, authority: String) => {
  try {
    const response = await zarinpal.post("/verify.json", {
      merchant_id: configs.zarinpal.merchantId,
      amount: amountInRial,
      authority,
    });

    const data = response.data.data;

    return data;
  } catch (error) {
    console.log(error);
  }
};

export { createPayment, verifyPayment };
