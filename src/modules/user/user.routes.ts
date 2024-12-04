import { Router } from "express";
const userRouter = Router();

import { edit, ban } from "./user.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";

userRouter.route("/:id").put(authorization, edit);

userRouter.post("/ban/:id", authorization, roleGuard(["admin"]), ban);

export default userRouter;
