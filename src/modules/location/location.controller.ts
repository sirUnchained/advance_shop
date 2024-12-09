import { NextFunction, Request, Response } from "express";
import { successRes } from "../../utils/sendRes";

import cities from "./../../cities/cities.json";
import provinces from "./../../cities/provinces.json";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    successRes(res, { cities, provinces }, 200);
  } catch (error) {
    next(error);
  }
};
