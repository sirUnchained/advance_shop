import { NextFunction, Request, Response } from "express";
import ProductModel from "../../models/Product.model";
import { errorRes, successRes } from "../../utils/sendRes";
import { isValidObjectId, Types } from "mongoose";
import {
  createProductValidator,
  updateProductValidator,
} from "./product.validator";
import { v4 } from "uuid";
import SubCategoryModel from "../../models/SubCategory.model";
import pagination from "../../utils/pagination";
import NoteModel from "../../models/Note.model";

const supportedFormats = [
  "image/svg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/jpeg",
];

export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      errorRes(res, { message: "product not found." }, 404);
      return;
    }

    const product = await ProductModel.findById(id)
      .populate("subSubCategory")
      .populate("sellers.seller")
      .lean();
    if (!product) {
      errorRes(res, { message: "product not found." }, 404);
      return;
    }

    successRes(res, { product }, 200);
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
    const {
      name,
      subSubCategory,
      minPrice,
      maxPrice,
      sellerID,
      filterValues,
      page = 1,
      limit = 10,
    } = req.query;

    const filters: any = {
      "seller.count": {
        $gt: 0,
      },
    };

    if (name) {
      filters.name = { $regex: name, options: "i" };
    }
    if (subSubCategory && typeof subSubCategory === "string") {
      filters.subSubCategory = {
        subSubCategory: Types.ObjectId.createFromHexString(subSubCategory),
      };
    }
    if (minPrice) {
      filters["seller.price"] = {
        $gt: minPrice,
      };
    }
    if (maxPrice) {
      filters["seller.price"] = {
        $gt: maxPrice,
      };
    }
    if (sellerID && typeof sellerID === "string") {
      filters["sellers.seller"] = Types.ObjectId.createFromHexString(sellerID);
    }
    if (filterValues && typeof filterValues === "string") {
      const parsedFilterValues = JSON.parse(filterValues);
      Object.keys(parsedFilterValues).forEach((key) => {
        filters[`filterValues.${key}`] = parsedFilterValues[key];
      });
    }

    const products = await ProductModel.aggregate([
      {
        $match: filters,
      },
      {
        $skip: (+page - 1) * +limit,
      },
      {
        $limit: +limit,
      },
    ]);

    const productCount = await ProductModel.countDocuments();
    console.log(products);

    successRes(res, pagination(productCount, products, +page, +limit), 200);
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
    let {
      name,
      slug,
      description,
      subSubCategory,
      sellers,
      filterValues,
      customFilters,
    } = req.body;
    if (sellers) sellers = JSON.parse(sellers);
    if (filterValues) filterValues = JSON.parse(filterValues);
    if (customFilters) customFilters = JSON.parse(customFilters);
    if (!isValidObjectId(subSubCategory)) {
      errorRes(res, { message: "sub sub category not found." }, 404);
      return;
    }

    const checkDuplicatedProduct = await ProductModel.findOne({ slug }).lean();
    if (checkDuplicatedProduct) {
      errorRes(
        res,
        { message: "product already exist.", product: checkDuplicatedProduct },
        400
      );
      return;
    }

    const checkSubSubCat = await SubCategoryModel.findById(subSubCategory);
    if (!checkSubSubCat) {
      errorRes(res, { message: "sub sub category not found." }, 404);
      return;
    }

    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      let file = null;
      for (let i = 0; i < req.files.length; i++) {
        file = req.files[i];
        if (!supportedFormats.includes(file.mimetype)) {
          errorRes(res, { message: "file format not supported." }, 400);
          return;
        }
        images.push(file.filename);
      }
    }

    let shortIdentifier = null;
    while (!shortIdentifier) {
      shortIdentifier = v4();
      const checkIdentifier = await ProductModel.findOne({ shortIdentifier });
      if (checkIdentifier) shortIdentifier = null;
    }

    await createProductValidator.validate(
      {
        name,
        slug,
        description,
        subSubCategory,
        sellers,
        filterValues,
        customFilters,
      },
      { abortEarly: false }
    );

    console.log("filterValues =>", filterValues);

    const newProduct = await ProductModel.create({
      name,
      slug,
      description,
      subSubCategory,
      sellers: sellers || [],
      filterValues: filterValues || {},
      customFilters: customFilters || {},
      images: images || null,
      shortIdentifier,
    });

    successRes(res, { newProduct }, 201);
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
      errorRes(res, { message: "product not found." }, 404);
      return;
    }

    const removedProduct = await ProductModel.findByIdAndDelete(id);
    if (!removedProduct) {
      errorRes(res, { message: "product not found." }, 404);
      return;
    }

    errorRes(res, { message: "product removed." }, 200);
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
    let {
      name,
      slug,
      description,
      subSubCategory,
      filterValues,
      customFilters,
    } = req.body;
    if (filterValues) filterValues = JSON.parse(filterValues);
    if (customFilters) customFilters = JSON.parse(customFilters);
    if (!isValidObjectId(subSubCategory)) {
      errorRes(res, { message: "sub sub category not found." }, 404);
      return;
    }

    await updateProductValidator.validate(
      {
        name,
        slug,
        description,
        subSubCategory,
        customFilters,
        filterValues,
      },
      { abortEarly: false }
    );

    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        if (!supportedFormats.includes(file.mimetype)) {
          errorRes(res, { message: "UnSupported image format !!" }, 400);
          return;
        }
        images.push(file.filename);
      }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        subSubCategory,
        customFilters,
        filterValues,
        images: images.length ? images : null,
      },
      { new: true }
    );
    if (!updatedProduct) {
      errorRes(res, { message: "Product not found !!" }, 404);
      return;
    }

    successRes(
      res,
      {
        message: "Product updated successfully.",
        product: updatedProduct,
      },
      200
    );
    return;
  } catch (error) {
    next(error);
  }
};
