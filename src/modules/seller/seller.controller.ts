import { NextFunction, Request, Response } from "express";
import SellerModel from "../../models/Seller.model";
import { errorRes, successRes } from "../../utils/sendRes";
import {
  createSellerValidator,
  updateSellerValidator,
} from "./seller.validator";

import cities from "./../../cities/cities.json";
import { isValidObjectId } from "mongoose";
import UserModel from "../../models/User.model";
import ProductModel from "../../models/Product.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await createSellerValidator.validate(req.body, { abortEarly: false });

    const { name, contactDetails, cityID } = req.body;

    const checkSeller = await SellerModel.findOne({
      $or: [{ name }, { _id: req.user._id }],
    });
    if (checkSeller) {
      errorRes(
        res,
        {
          message: "seller already exist or you may already created your shop.",
        },
        400
      );
      return;
    }
    // checking duplication of contacts
    const checkContactDetails = await SellerModel.findOne({
      $or: [
        {
          contactDetails: { phone: contactDetails.phone },
        },
        {
          contactDetails: { telegramID: contactDetails.telegramID },
        },
        {
          contactDetails: { instagramID: contactDetails.instagramID },
        },
      ],
    });
    if (checkContactDetails) {
      // const repeatedContacts = checkContactDetails.contactDetails;
      errorRes(
        res,
        {
          message:
            "some contacts are duplicated pleas chose another or contact our admins.",
        },
        400
      );
      return;
    }

    const city = cities.findIndex((city) => city.id === cityID);
    if (city == -1) {
      errorRes(res, { message: "city is not valid." }, 400);
      return;
    }

    await SellerModel.create({
      name,
      contactDetails,
      cityID,
      user: req.user,
    });
    await UserModel.updateOne(
      { _id: req.user._id },
      {
        $addToSet: {
          roles: "seller",
        },
      }
    );

    successRes(res, { message: "created." }, 201);
    return;
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "seller not found." }, 404);
      return;
    }

    const seller = await SellerModel.findByIdAndDelete(id);
    if (!seller) {
      errorRes(res, { message: "seller not found." }, 404);
      return;
    }

    await ProductModel.deleteMany({ "sellers.seller": seller.user });

    await UserModel.updateOne(
      {
        _id: req.user._id,
      },
      {
        $pull: {
          roles: "seller",
        },
      }
    );

    successRes(res, { message: "removed." }, 200);
    return;
  } catch (error) {
    next(error);
  }
};

export const edit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "seller not found." }, 404);
      return;
    }

    await updateSellerValidator.validate(req.body, { abortEarly: false });

    const { name, contactDetails, cityID } = req.body;
    // checking duplication of contacts
    const checkContactDetails = await SellerModel.findOne({
      _id: {
        $ne: id,
      },
      $or: [
        {
          contactDetails: { phone: contactDetails.phone },
        },
        {
          contactDetails: { telegramID: contactDetails.telegramID },
        },
        {
          contactDetails: { instagramID: contactDetails.instagramID },
        },
      ],
    });
    if (checkContactDetails) {
      // const repeatedContacts = checkContactDetails.contactDetails;
      errorRes(
        res,
        {
          message:
            "some contacts are duplicated pleas chose another or contact our admins.",
        },
        400
      );
      return;
    }

    const seller = await SellerModel.findById(id);
    if (!seller) {
      errorRes(res, { message: "seller not found." }, 404);
      return;
    }
    seller.name = name || seller.name;
    seller.cityID = cityID || seller.cityID;
    seller.contactDetails = contactDetails || seller.contactDetails;
    await seller.save();

    successRes(res, { message: "updated." }, 200);
    return;
  } catch (error) {
    next(error);
  }
};

export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    const seller = await SellerModel.findOne({ user: user._id }).lean();
    if (!seller) {
      errorRes(res, { message: "no seller found." }, 404);
      return;
    }

    successRes(res, { seller }, 200);
    return;
  } catch (error) {
    next(error);
  }
};
