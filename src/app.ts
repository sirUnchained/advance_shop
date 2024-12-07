import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorRes } from "./utils/sendRes";
import errorHandler from "./utils/errorHandler";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/category/category.routes";
import userRouter from "./modules/user/user.routes";
import sellerRouter from "./modules/seller/seller.routes";
import productRouter from "./modules/product/product.routes";
import sellerRequestRouter from "./modules/sellerRequest/sellerRequest.routes";
import commentRouter from "./modules/comment/comment.routes";

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/user", userRouter);
app.use("/seller", sellerRouter);
app.use("/product", productRouter);
app.use("/seller-Request", sellerRequestRouter);
app.use("/comment", commentRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    errorRes(res, { message: "sorry route not found." }, 404);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

export default app;
