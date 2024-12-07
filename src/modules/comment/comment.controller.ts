import { NextFunction, Request, Response } from "express";
import CommentModel from "../../models/Comment.model";
import { errorRes, successRes } from "../../utils/sendRes";
import pagination from "../../utils/pagination";
import {
  addReplyValidator,
  createCommentValidator,
  updateCommentValidator,
  updateReplyValidator,
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

    const { content, rating } = req.body;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    const comment = await CommentModel.findById(id);
    if (!comment) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    } else if (comment.user.toString() !== req.user._id.toString()) {
      errorRes(res, { message: "you cant edit anotehr user comment." }, 200);
      return;
    }

    comment.content = content;
    comment.rating = rating;
    await comment.save();

    successRes(res, { comment }, 200);
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
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    const comment = await CommentModel.findByIdAndDelete(id);
    if (!comment) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    successRes(res, { comment }, 200);
    return;
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
    await addReplyValidator.validate(req.body, { abortEarly: false });

    const { content } = req.body;
    const user = req.user;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    const comment = await CommentModel.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: {
            user: user._id,
            content,
          },
        },
      },
      {
        new: true,
      }
    );
    if (!comment) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    successRes(res, { message: "reply added." }, 201);
    return;
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
    const { commentID, replyID } = req.params;
    if (!isValidObjectId(commentID) || !isValidObjectId(replyID)) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    // const comment = await CommentModel.findOneAndUpdate(
    //   {
    //     _id: commentID,
    //   },
    //   {
    //     $pull: {
    //       replies: {
    //         _id: replyID,
    //       },
    //     },
    //   },
    //   {
    //     new: true,
    //   }
    // );

    const comment = await CommentModel.findById(commentID);
    if (!comment) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    comment.replies.pull(replyID);
    await comment.save();

    successRes(res, { message: "removed." }, 200);
    return;
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
    await updateReplyValidator.validate(req.body, { abortEarly: false });

    const { content } = req.body;
    const { commentID, replyID } = req.params;
    if (!isValidObjectId(commentID) || !isValidObjectId(replyID)) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    const comment = await CommentModel.findById(commentID);
    if (!comment) {
      errorRes(res, { message: "comment not found" }, 404);
      return;
    }

    comment.replies.find((reply) => {
      if (reply._id.toString() === replyID.toString()) {
        reply.content = content;
        return;
      }
    });
    await comment.save();

    successRes(res, { message: "reply updated." }, 200);
    return;
  } catch (error) {
    next(error);
  }
};
