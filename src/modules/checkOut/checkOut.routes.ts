import { Router } from "express";
const checkOutRouter = Router();

import { createCheckout, verifyCheckout } from "./checkOut.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";

checkOutRouter.route("/").post(authorization, createCheckout);
checkOutRouter.route("/verify").get(verifyCheckout);

export default checkOutRouter;
