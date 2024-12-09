import { Router } from "express";
const locationRouter = Router();

import { getAll } from "./location.controller";
// import authorization from "../../middleWares/auth.middleWare";
// import roleGuard from "../../middleWares/roleGuard.middleWare";

locationRouter.route("/").get(getAll);

export default locationRouter;
