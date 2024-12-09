import { Router } from "express";
const orderRouter = Router();

import { getAll, update } from "./order.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";

orderRouter.route("/").get(authorization, roleGuard(["admin"]), getAll);

orderRouter.route("/:id").put(authorization, roleGuard(["admin"]), update);

export default orderRouter;
