import { Router } from "express";
const sellerRouter = Router();

import { create, remove, edit, get } from "./seller.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";

sellerRouter.route("/").get(authorization, get).post(authorization, create);
sellerRouter
  .route("/:id")
  .put(authorization, roleGuard(["seller"]), edit)
  .delete(authorization, roleGuard(["admin"]), remove);

export default sellerRouter;
