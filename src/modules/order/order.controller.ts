import { NextFunction, Request, Response } from "express";
import { updateOrderValidator } from "./order.validator";
import { isValidObjectId } from "mongoose";
import { errorRes, successRes } from "../../utils/sendRes";
import OrderModel from "../../models/Order.model";
import pagination from "../../utils/pagination";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user;

    const filters = {
      ...(user.roles.includes("admin") ? {} : { _id: user._id }),
    };

    const orders = await OrderModel.find(filters)
      .sort({ createdAt: "desc" })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate("user")
      .populate("items.product")
      .populate("items.seller");

    const ordersCount = await OrderModel.countDocuments();

    return successRes(
      res,
      pagination(ordersCount, { orders }, +page, +limit),
      200
    );
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
    await updateOrderValidator.validate(req.body, { abortEarly: false });

    const { status, postTrackingCode } = req.body;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return errorRes(res, { message: "order not foumd." }, 404);
    }

    await OrderModel.findByIdAndUpdate(id, {
      status,
      postTrackingCode,
    });

    return successRes(
      res,
      {
        message: "updated",
      },
      200
    );
  } catch (error) {
    next(error);
  }
};
