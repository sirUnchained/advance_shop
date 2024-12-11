const configs = {
  mongoURI: process.env.MONGO_URI as string,
  port: process.env.PORT as string,
  redisURI: process.env.REDIS_URI as string,
  farazSMS: {
    username: process.env.FARAZ_SMS_USERNAME as string,
    password: process.env.FARAZ_SMS_PASSWORD as string,
    patternCode: process.env.FARAZ_SMS_PATTERN_CODD as string,
    formNum: process.env.FARAZ_SMS_FROMNUM as string,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY as string,
    expireTime: process.env.JWT_EXPIRE_TIME as string,
  },
  zarinpal: {
    baseUrl: process.env.ZARINPAL_API_BASE_URL as String,
    merchantId: process.env.ZARINPAL_MERCHANT_ID as String,
    paymentBaseUrl: process.env.ZARINPAL_PAYMENT_BASE_URL as String,
    paymantCallbackUrl: process.env.ZARINPAL_PAYMENT_CALLBACK_URL as String,
  },
};

export default configs;
