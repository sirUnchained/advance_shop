import { NextFunction, Request, Response } from "express";
import ProductModel from "../../models/Product.model";
import { errorRes, successRes } from "../../utils/sendRes";
import NoteModel from "../../models/Note.model";
import { isValidObjectId } from "mongoose";
import pagination from "../../utils/pagination";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;

    const notes = await NoteModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate(
        "product",
        "-subSubCategory -sellers -filterValues -customFilters -shordIdentifier"
      )
      .lean();

    const allNNotes = pagination(notes.length, notes, +page, +limit);

    return successRes(res, { allNNotes }, 200);
  } catch (error) {
    next(error);
  }
};

export const addNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, content } = req.body;
    const user = req.user;

    const product = await ProductModel.findById(productId);
    if (!product) {
      errorRes(res, { message: "Product not found !!" }, 400);
      return;
    }

    //* Validator

    const existingNote = await NoteModel.findOne({
      user: user._id,
      product: productId,
    });
    if (existingNote) {
      return errorRes(
        res,
        { message: "Another note already exist for this product" },
        400
      );
    }

    const newNote = await NoteModel.create({
      user: user._id,
      product: productId,
      content,
    });

    return successRes(
      res,
      {
        message: "note created.",
        note: newNote,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const { noteID } = req.params;
    if (!isValidObjectId(noteID)) {
      return errorRes(res, { message: "note mot found." }, 404);
    }

    const note = await NoteModel.findById(noteID)
      .populate("user")
      .populate("product")
      .lean();
    if (note?.user?._id.toString() !== user._id.toString() || !note) {
      return errorRes(
        res,
        { message: "Note not found on you have not access to this note" },
        404
      );
    }
    if (!note.product) {
      await NoteModel.findByIdAndDelete(noteID);
      return errorRes(
        res,
        { message: "This product has been removed !!" },
        404
      );
    }

    const product = {
      ...note.product,
      note: {
        _id: note._id,
        content: note.content,
      },
    };

    return successRes(
      res,
      {
        product,
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const editNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const { noteID } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(noteID)) {
      return errorRes(res, { message: "note mot found." }, 404);
    }

    const existingNote = await NoteModel.findById(noteID);
    if (existingNote?.user.toString() !== user._id.toString()) {
      return errorRes(res, { message: "no access to remove the note." }, 404);
    }

    await NoteModel.findOneAndUpdate({ _id: noteID }, { content });
    return successRes(res, { message: "done" }, 200);
  } catch (error) {
    next(error);
  }
};

export const removeNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const { noteID } = req.params;
    if (!isValidObjectId(noteID)) {
      return errorRes(res, { message: "note mot found." }, 404);
    }

    const existingNote = await NoteModel.findById(noteID);
    if (existingNote?.user.toString() !== user._id.toString()) {
      return errorRes(
        res,
        { message: "note not found or you have no access." },
        404
      );
    }

    const deletedNote = await NoteModel.findByIdAndDelete(noteID);
    return successRes(res, { deletedNote }, 200);
  } catch (error) {
    next(error);
  }
};
