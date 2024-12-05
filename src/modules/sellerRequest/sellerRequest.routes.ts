import { Router } from "express";
const sellerRequestRouter = Router();

import {
  becomeSeller,
  remove,
  get,
  getAll,
  update,
} from "./sellerRequest.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";

sellerRequestRouter
  .route("/")
  .get(authorization, roleGuard(["admin"]), getAll)
  .post(authorization, becomeSeller);

sellerRequestRouter
  .route("/:id")
  .get(authorization, get)
  .delete(authorization, remove)
  .put(authorization, roleGuard(["admin"]), update);

export default sellerRequestRouter;
