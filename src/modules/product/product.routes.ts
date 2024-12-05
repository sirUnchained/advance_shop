import { Router } from "express";
const productRouter = Router();

import { create, remove, edit, get, getAll } from "./product.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";
import multerStorage from "../../utils/uploader";

const uploader = multerStorage("public/photos/product_pics", true);

productRouter
  .route("/")
  .post(
    authorization,
    roleGuard(["admin", "seller"]),
    uploader.array("pics", 5),
    create
  )
  .get(getAll);

productRouter
  .route("/:id")
  .delete(authorization, roleGuard(["admin"]), remove)
  .put(authorization, roleGuard(["admin"]), edit)
  .get(get);

export default productRouter;
