import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { errorRes } from "../utils/sendRes";
import configs from "../configENV";
import UserModel from "../models/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

async function authorization(req: Request, res: Response, next: NextFunction) {
  try {
    const bearerToken: string | undefined = req.headers.authorization;
    if (!bearerToken) {
      errorRes(res, { message: "you are not registered." }, 401);
      return;
    }

    const token = bearerToken.replace("Bearer ", "");

    const payload = verify(token, configs.jwt.secretKey);
    if (!payload) {
      errorRes(res, { message: "you are not registered." }, 401);
      return;
    }

    let user = null;
    if (typeof payload === "object" && "_id" in payload) {
      user = await UserModel.findById(payload._id);
      if (!user) {
        errorRes(res, { message: "you are not registered." }, 401);
        return;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    errorRes(res, { message: "you are not registered." }, 401);
    return;
  }
}

export default authorization;
