import { NextFunction, Request, Response } from "express";
import { errorRes } from "./sendRes";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.name === "ValidationError") {
    // console.log(error);
    errorRes(res, { errors: error.errors }, 400);
    return;
  }

  console.log(error);
  errorRes(res, { message: "internal server error." }, 500);
  return;
}

export default errorHandler;

/* 
errorResponse: {
    index: 0,
    code: 11000,
    errmsg: 'E11000 duplicate key error collection: advane_shop.users index: email_1 dup key: { email: null }',
    keyPattern: { email: 1 },
    keyValue: { email: null }
  },
  index: 0,
  code: 11000,
  keyPattern: { email: 1 },
  keyValue: { email: null },
  [Symbol(errorLabels)]: Set(0) {}
}
*/
