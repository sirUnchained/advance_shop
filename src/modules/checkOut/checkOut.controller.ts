import { NextFunction, Request, Response } from "express";
import { createCheckoutValidator } from "./checkout.validator";
import CartModel from "../../models/Cart.model";
import { errorRes, successRes } from "../../utils/sendRes";
import { ObjectId } from "mongoose";
import CheckOutModel from "../../models/CheckOut.model";
import { createPayment, verifyPayment } from "../../services/zarinpal.service";
import OrderModel from "../../models/Order.model";
import ProductModel from "../../models/Product.model";

export const createCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await createCheckoutValidator.validate(req.body, { abortEarly: false });

    const user = req.user;
    const { shippingAddress } = req.body;

    const cart = await CartModel.findOne({ user: user._id })
      .populate("items.product")
      .populate("items.seller");

    if (!cart?.items?.length) {
      return errorRes(res, { messgae: "your cart is empty." }, 400);
    }

    const checkoutItems = [];
    for (const item of cart.items) {
      const { product, seller } = item as any;

      const sellerDetails = product.sellers.find(
        (sellerInfo: any) =>
          sellerInfo.seller.toString() === seller._id.toString()
      );

      if (!sellerDetails) {
        return errorRes(
          res,
          { message: "seller dose not sell this product." },
          400
        );
      }

      checkoutItems.push({
        product: product._id,
        seller: seller._id,
        count: item.count,
        price: sellerDetails.price,
      });
    }

    const newCheckout: any = new CheckOutModel({
      user: user._id,
      items: checkoutItems,
      shippingAddress,
    });

    const payment = await createPayment(
      newCheckout.totalPrice,
      `سفارش با شناسه ${newCheckout._id}`,
      "09921558293"
    );
    if (!payment) {
      errorRes(res, { message: "payment creating failed." }, 400);
      return;
    }
    newCheckout.authority = payment.authority;

    await newCheckout.save();

    return successRes(
      res,
      {
        message: "Checkout created successfully.",
        checkout: newCheckout,
        paymentUrl: payment.paymentUrl,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const verifyCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { Authority: authority } = req.query;

    const alreadyCreatedOrder = await OrderModel.findOne({ authority });
    if (alreadyCreatedOrder) {
      return errorRes(res, { message: "Payment already verified." }, 400);
    }

    const checkout: any = await CheckOutModel.findOne({ authority });
    if (!checkout || !authority) {
      return errorRes(res, { message: "checkout not found." }, 404);
    }

    const payment = await verifyPayment(
      authority.toString(),
      checkout.totalPrice
    );
    if (![100, 101].includes(payment.code)) {
      return errorRes(res, { message: "payment not found." }, 400);
    }

    const order = new OrderModel({
      user: checkout.user,
      authority: checkout.authority,
      items: checkout.items,
      shippingAddress: checkout.shippingAddress,
    });
    await order.save();

    // if user by item then it'll remove it's count from seller
    for (const item of checkout.items) {
      const product: any = await ProductModel.findById(item.product);

      if (product) {
        const sellerInfo = product.sellers.find(
          (sellerData: any) =>
            sellerData.seller.toString() === item.seller.toString()
        );

        sellerInfo.stock -= item.count;
        await product.save();
      }
    }

    await CartModel.findOneAndUpdate({ user: checkout.user }, { items: [] });

    await CheckOutModel.deleteOne({ _id: checkout._id });

    return successRes(
      res,
      {
        message: "Payment verified.",
        order,
      },
      200
    );
  } catch (error) {
    next(error);
  }
};
