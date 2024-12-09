import { NextFunction, Request, Response } from "express";
import ProductModel from "../../models/Product.model";

export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { link = "" } = req.params;

    const product = await ProductModel.findOne({
      shortIdentifier: link,
    });
    if (!product) {
      res.redirect("/");
      return;
    }

    res.redirect(`/product/${product._id}`);
    return;
  } catch (error) {
    next(error);
  }
};
