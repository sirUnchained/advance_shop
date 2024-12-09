import { NextFunction, Request, Response } from "express";
import UserModel from "../../models/User.model";
import { errorRes, successRes } from "../../utils/sendRes";
import { isValidObjectId } from "mongoose";
import BannedModel from "../../models/Ban.model";
import SellerModel from "../../models/Seller.model";
import ProductModel from "../../models/Product.model";

export const edit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { username, email, addresses } = req.body;

    const checkEmailAndUserName = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (checkEmailAndUserName) {
      errorRes(res, { message: "email or username duplicated." }, 404);
      return;
    }

    const currentUSer = await UserModel.findById(req.user._id);
    if (!currentUSer) {
      errorRes(res, { message: "user not found." }, 404);
      return;
    }

    currentUSer.username = username;
    currentUSer.email = email;
    if (addresses) {
      currentUSer.addresses = addresses;
    }
  } catch (error) {
    next(error);
  }
};

export const ban = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "user not found." }, 404);
      return;
    }

    if (req.user._id.toString() === id.toString()) {
      errorRes(res, { message: "you can't ban yourself." }, 400);
      return;
    }

    const removesdUser: any = await UserModel.findByIdAndDelete(id);
    if (!removesdUser) {
      errorRes(res, { message: "user not found." }, 404);
      return;
    }

    await BannedModel.create({
      phone: removesdUser.phone,
    });

    successRes(res, { message: "removed." }, 200);
    return;
  } catch (error) {
    next(error);
  }
};
