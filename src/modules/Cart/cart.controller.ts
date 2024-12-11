import { NextFunction, Request, Response } from "express";
import CartModel from "../../models/Cart.model";
import { errorRes, successRes } from "../../utils/sendRes";
import { addToCartValidator, removeFromCartValidator } from "./cart.validator";
import { isValidObjectId } from "mongoose";
import ProductModel from "../../models/Product.model";
import SellerModel from "../../models/Seller.model";

export const getItemsInCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    const cart = await CartModel.findOne({ user: user._id })
      .populate("items.product")
      .populate("items.seller")
      .lean();
    if (!cart) {
      successRes(res, {}, 200);
      return;
    }

    successRes(res, { cart: cart.items }, 200);
    return;
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await addToCartValidator.validate(req.body, { abortEarly: false });

    const user = req.user;
    const { sellerID, productID, quantity } = req.body;
    if (!isValidObjectId(productID)) {
      return errorRes(res, { message: "product not found." }, 404);
    }
    if (!isValidObjectId(sellerID)) {
      return errorRes(res, { message: "seller not found." }, 404);
    }

    const product = await ProductModel.findById(productID);
    if (!product) {
      return errorRes(res, { message: "product not found." }, 404);
    }
    const seller = await SellerModel.findById(sellerID);
    if (!seller) {
      return errorRes(res, { message: "seller not found." }, 404);
    }

    const checkSellerProduct = product.sellers.find(
      (item) => item.seller.toString() === sellerID.toString()
    );
    if (!checkSellerProduct) {
      errorRes(
        res,
        { message: "seller dose not sale this product anymore." },
        400
      );
      return;
    }

    const userCart = await CartModel.findOne({ user: user._id });
    const price = checkSellerProduct.price;
    if (!userCart) {
      const newCart = await CartModel.create({
        user: user._id,
        items: [
          {
            product: product._id,
            seller: seller._id,
            count: quantity,
            price,
          },
        ],
      });

      successRes(res, { cart: newCart }, 201);
      return;
    }

    const indexOfItem = userCart.items.findIndex(
      (item) =>
        item.seller.toString() === sellerID.toString() &&
        item.product.toString() === productID.toString()
    );
    if (indexOfItem != -1) {
      userCart.items[indexOfItem].count += 1;
      userCart.items[indexOfItem].price = price;
    } else {
      userCart.items.push({
        product: productID,
        seller: sellerID,
        count: quantity,
        price,
      });
    }

    await userCart.save();
    successRes(res, { message: "added to cart." }, 201);
    return;
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await removeFromCartValidator.validate(req.body, { abortEarly: false });

    const user = req.user;
    const { sellerID, productID } = req.body;
    if (!isValidObjectId(productID)) {
      return errorRes(res, { message: "product not found." }, 404);
    }
    if (!isValidObjectId(sellerID)) {
      return errorRes(res, { message: "seller not found." }, 404);
    }

    const product = await ProductModel.findById(productID);
    if (!product) {
      return errorRes(res, { message: "product not found." }, 404);
    }
    const seller = await SellerModel.findById(sellerID);
    if (!seller) {
      return errorRes(res, { message: "seller not found." }, 404);
    }

    const cart = await CartModel.findOne({ user: user._id });
    if (!cart) {
      return errorRes(res, { message: "cart not found." }, 404);
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productID.toString() &&
        item.seller.toString() === sellerID.toString()
    );
    if (itemIndex === -1) {
      return errorRes(res, { message: "cart not found." }, 404);
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return successRes(res, { message: "removed." }, 200);
  } catch (error) {
    next(error);
  }
};
