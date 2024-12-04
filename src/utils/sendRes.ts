import { Response } from "express";

const errorRes = (res: Response, message: any, status: number = 500): void => {
  res.status(status).json(message);
  return;
};

const successRes = (
  res: Response,
  message: any,
  status: number = 200
): void => {
  res.status(status).json(message);
  return;
};

export { successRes, errorRes };
