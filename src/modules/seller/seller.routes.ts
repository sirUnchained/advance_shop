import { Router } from "express";
const sellerRouter = Router();

import { create, remove, edit, get } from "./seller.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";
// import multerStorage from "../../utils/uploader";

// const uploader = multerStorage("public/photos/product_pics", true);

sellerRouter.route("/").get(authorization, get).post(authorization, create);
sellerRouter
  .route("/:id")
  .put(authorization, roleGuard(["seller"]), edit)
  .delete(authorization, roleGuard(["admin"]), remove);

export default sellerRouter;
