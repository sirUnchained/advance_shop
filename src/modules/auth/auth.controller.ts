import { NextFunction, Response, Request } from "express";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import UserModel from "../../models/User.model";
import BannedModel from "../../models/Ban.model";
import { sendOtpValidator, otpValidator } from "./auth.validators";
import sendSMS from "../../services/farazSMS.service";
import { errorRes, successRes } from "../../utils/sendRes";
import redis from "../../redis";
import configs from "../../configENV";

function generateOPTPattern(phone: string): string {
  return `otp-for-phone->${phone}`;
}
async function generateRandomOTP(phone: string): Promise<string | null> {
  const isThisPhoneHaveOtp = await redis.get(generateOPTPattern(phone));
  if (isThisPhoneHaveOtp) {
    return null;
  }

  const alphabets: string = "1234567890";
  let otp: string = "";
  const lengthPfOtp: number = 5;
  const expireTimeOfOtp: number = 2 * 60;

  for (let i = 0; i < lengthPfOtp; i++) {
    otp += alphabets[Math.floor(Math.random() * 10)];
  }

  // ! WARNING
  otp = "1111";
  const hashedOtp = await hash(otp, 10);

  await redis.set(generateOPTPattern(phone), hashedOtp, "EX", expireTimeOfOtp);
  return otp;
}
async function getOTPDetails(phone: string): Promise<string | null> {
  const searchForOtp = await redis.get(generateOPTPattern(phone));
  return searchForOtp;
}

export const send = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await sendOtpValidator.validate(req.body, { abortEarly: false });

    const { phone } = req.body;

    const isPhoneBanned = await BannedModel.findOne({ phone });
    if (isPhoneBanned) {
      errorRes(res, { message: "this phone number is banned." }, 403);
      return;
    }

    const otp: string | null = await generateRandomOTP(phone);
    if (!otp) {
      errorRes(
        res,
        { message: "we already send an otp, wait for 2 minutes." },
        400
      );
    }
    // await sendSMS(otp, phone);

    successRes(res, { message: "otp generated for you." }, 201);
    return;
  } catch (error) {
    next(error);
  }
};

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await otpValidator.validate(req.body, { abortEarly: false });

    const { otp, phone, isSeller } = req.body;

    const searchForOtp: string | null = await getOTPDetails(phone);
    if (!searchForOtp) {
      errorRes(res, { message: "otp time is expired." }, 404);
      return;
    }

    // const checkOtpResult: boolean = searchForOtp === otp;
    const checkOtpResult: boolean = await compare(otp, searchForOtp);
    if (!checkOtpResult) {
      errorRes(res, { message: "you enter wrong otp." }, 400);
      return;
    }

    const isPhoneBanned = await BannedModel.findOne({ phone });
    if (isPhoneBanned) {
      errorRes(res, { message: "this phone number is banned." }, 403);
      return;
    }

    const checkUserExist = await UserModel.findOne({ phone });
    if (checkUserExist) {
      const newToken: string = sign(
        { _id: checkUserExist._id },
        configs.jwt.secretKey,
        {
          expiresIn: configs.jwt.expireTime,
        }
      );

      successRes(res, { token: newToken }, 200);
      return;
    }

    const isFirstUser: number = await UserModel.countDocuments();

    const newUser = new UserModel({
      username: `${Math.floor(Math.random() * 10e5)}-${Date.now()}`,
      phone,
      roles:
        isFirstUser === 0
          ? ["admin"]
          : isSeller
          ? ["user", "seller"]
          : ["user"],
    });
    await newUser.save();

    const token = sign({ _id: newUser._id }, configs.jwt.secretKey, {
      expiresIn: configs.jwt.expireTime,
    });
    successRes(res, { token }, 201);
    return;
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    successRes(res, { user }, 200);
    return;
  } catch (error) {
    next(error);
  }
};
