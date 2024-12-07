import { NextFunction, Request, Response } from "express";
import CommentModel from "../../models/Comment.model";
import { errorRes, successRes } from "../../utils/sendRes";
import pagination from "../../utils/pagination";
import {
  createCommentValidator,
  updateCommentValidator,
} from "./comment.validator";
import { isValidObjectId } from "mongoose";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const comments = await CommentModel.find()
      .sort({ createdAt: "desc" })
      .skip((+limit - 1) * +page)
      .limit(+limit)
      .populate("product")
      .populate("user")
      .populate("replies.user");

    const commentCound = await CommentModel.countDocuments();

    successRes(res, pagination(commentCound, comments, +page, +limit), 200);
    return;
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await createCommentValidator.validate(req.body, { abortEarly: false });

    const { product, rating, content } = req.body;
    const user = req.user;
    if (!isValidObjectId(product)) {
      errorRes(res, { message: "product not found" }, 404);
      return;
    }

    const comment = await CommentModel.create({
      product,
      rating,
      content,
      user: user._id,
    });

    successRes(res, { comment }, 201);
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
    await updateCommentValidator.validate(req.body, { abortEarly: false });
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
    // todo
  } catch (error) {
    next(error);
  }
};

export const reply = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // todo
  } catch (error) {
    next(error);
  }
};

export const removeReply = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // todo
  } catch (error) {
    next(error);
  }
};

export const updateReply = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // todo
  } catch (error) {
    next(error);
  }
};
