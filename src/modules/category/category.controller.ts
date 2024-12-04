import { NextFunction, Request, Response } from "express";
import { categoryEditValidator, categoryValidator } from "./category.validator";
import { errorRes, successRes } from "../../utils/sendRes";
import CategoryModel from "../../models/Category.model";
import { isValidObjectId } from "mongoose";

const supportedFormats = [
  "image/svg",
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { title, slug, parent, description, filters } = req.body;
    filters = JSON.parse(filters);

    if (parent) {
      const parentItem = await CategoryModel.findById(parent);
      if (!parentItem) {
        errorRes(res, { message: "parent dose not exist." }, 404);
        return;
      }
    }

    await categoryValidator.validate(
      { title, slug, parent, description, filters },
      { abortEarly: false }
    );

    let icon = null;
    if (req.file) {
      const { filename, mimetype } = req.file;

      if (!supportedFormats.includes(mimetype)) {
        errorRes(res, { message: `"${mimetype}" is not supported.` }, 400);
        return;
      }

      icon = {
        filename,
        path: `photos/category_icons/${filename}`,
      };
    }

    await CategoryModel.create({
      title,
      slug,
      parent: parent ? parent : null,
      description,
      filters,
      icon,
    });

    successRes(res, { message: "category created." }, 201);
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
      errorRes(res, { message: "category not found." }, 404);
      return;
    }

    const remmovedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!remmovedCategory) {
      errorRes(res, { message: "category not found." }, 404);
      return;
    }

    successRes(res, { message: "category removed." }, 200);
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
    let { title, slug, parent, description, filters } = req.body;
    if (filters) {
      filters = JSON.parse(filters);
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "category not found." }, 404);
      return;
    }

    await categoryEditValidator.validate(
      { title, slug, parent, description, filters },
      { abortEarly: false }
    );

    let icon = null;
    if (req.file) {
      const { filename, mimetype } = req.file;

      if (!supportedFormats.includes(mimetype)) {
        errorRes(res, { message: "Unsupported image format !!" }, 400);
        return;
      }

      icon = {
        filename,
        path: `images/category-icons/${filename}`,
      };
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      errorRes(res, { message: "Category not found !!" }, 404);
      return;
    }

    category.title = title;
    category.slug = slug;
    category.parent = parent ? parent : null;
    category.description = description;
    if (filters) {
      category.filters = filters;
    }
    if (icon) {
      category.icon = icon;
    }
    await category.save();

    successRes(res, { message: "category updated." }, 200);
    return;
  } catch (error) {
    next(error);
  }
};
