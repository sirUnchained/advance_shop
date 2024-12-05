import { NextFunction, Request, Response } from "express";
import {
  createSellerRequestValidator,
  updateSellerRequestValidator,
} from "./sellerRequest.validator";
import { isValidObjectId } from "mongoose";
import SellerModel from "../../models/Seller.model";
import { errorRes, successRes } from "../../utils/sendRes";
import ProductModel from "../../models/Product.model";
import sellerRequestModel from "../../models/SellerRequest.model";
import pagination from "../../utils/pagination";

export const becomeSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await createSellerRequestValidator.validate(req.body, {
      abortEarly: false,
    });

    const { productId, price, count } = req.body;
    const user = req.user;

    const checkSeller = await SellerModel.findOne({ user: user._id });
    if (!checkSeller) {
      errorRes(res, { message: "you are not a seller." }, 400);
      return;
    }

    const checkProduct = await ProductModel.findById(productId);
    if (!checkProduct) {
      errorRes(res, { message: "product not found." }, 404);
    }

    const checkExistingRequest = await sellerRequestModel.findOne({
      seller: checkSeller._id,
    });
    if (checkExistingRequest) {
      errorRes(res, { message: "you already create a request." }, 400);
      return;
    }

    const request = await sellerRequestModel.create({
      seller: checkSeller._id,
      product: productId,
      price,
      count,
    });

    successRes(res, { request }, 201);
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
    const user = req.user;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "request not found." }, 404);
      return;
    }

    const request = await sellerRequestModel.findById(id);
    if (!request || !request.seller) {
      errorRes(res, { message: "request not found." }, 404);
      return;
    }

    const seller = await SellerModel.findOne({ user: user._id });
    if (!seller || !seller._id) {
      errorRes(res, { message: "seller not found." }, 404);
      return;
    }

    let removedRequest = null;
    if (user.roles.includes("admin")) {
      removedRequest = await sellerRequestModel.findByIdAndDelete(id);
    } else if (seller._id.toString() === request.seller.toString()) {
      removedRequest = await sellerRequestModel.findByIdAndDelete(id);
    }

    removedRequest
      ? successRes(res, { result: removedRequest }, 200)
      : errorRes(res, { message: "request not found" }, 404);

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
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "request not found." }, 404);
      return;
    }

    const checkExistingRequest = await sellerRequestModel.findById(id);
    if (!checkExistingRequest) {
      errorRes(res, { message: "request not found." }, 404);
      return;
    }

    successRes(res, { request: checkExistingRequest }, 200);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const { status = "pending", page = 1, limit = 10 } = req.query;
    console.log(req.query);

    const seller = await SellerModel.findOne({ user: user._id });
    if (!seller) {
      errorRes(res, "Seller not found !!", 404);
      return;
    }

    const sellerRequests = await sellerRequestModel
      .find({
        seller: seller._id,
        status,
      })
      .sort({
        createdAt: "desc",
      })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .lean();

    successRes(
      res,
      pagination(sellerRequests.length, sellerRequests, +page, +limit)
    );
    return;
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await updateSellerRequestValidator.validate(req.body, {
      abortEarly: false,
    });
    const { id } = req.params;
    const { status, adminComment } = req.body;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "request not found." }, 404);
      return;
    }

    const checkExistingRequest = await sellerRequestModel.findById(id);
    if (!checkExistingRequest) {
      errorRes(res, { message: "request not found." }, 404);
      return;
    }

    if (status === "reject") {
      checkExistingRequest.status = "rejected";
      if (adminComment) {
        checkExistingRequest.adminComment = adminComment;
      }

      await checkExistingRequest.save();
      return successRes(
        res,
        {
          message: "Seller request rejected !!",
        },
        200
      );
    } else if (status === "accept") {
      const product = await ProductModel.findById(checkExistingRequest.product);
      if (!product || !checkExistingRequest.seller) {
        errorRes(res, "Product not found !!", 404);
        return;
      }

      const existingProductSeller = product.sellers.find((seller) => {
        if (checkExistingRequest.seller) {
          return (
            seller.seller.toString() === checkExistingRequest.seller.toString()
          );
        }
      });
      if (existingProductSeller) {
        errorRes(
          res,
          { message: "Seller already exists for this product !!" },
          400
        );
        return;
      }
      product.sellers.push({
        seller: checkExistingRequest.seller,
        count: checkExistingRequest.count,
        price: checkExistingRequest.price,
      });
      await product.save();

      checkExistingRequest.status = "accepted";
      await checkExistingRequest.save();

      return successRes(
        res,
        {
          message:
            "Seller request accepted successfully and added to the product",
        },
        200
      );
    }
  } catch (error) {
    next(error);
  }
};
