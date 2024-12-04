import { NextFunction, Request, Response } from "express";
import { errorRes } from "../utils/sendRes";

function roleGuard(roles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    try {
      const user = req.user;
      roles.forEach((role) => {
        if (!user.roles.includes(role)) {
          errorRes(res, { message: "access denied." }, 403);
          return;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default roleGuard;
