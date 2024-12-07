import { Router } from "express";
const commentRouter = Router();

import {
  getAll,
  create,
  edit,
  remove,
  reply,
  removeReply,
  updateReply,
} from "./comment.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";

commentRouter.route("/").get(authorization, roleGuard(["admin"]), getAll);

commentRouter
  .route("/:id")
  .post(authorization, create)
  .put(authorization, edit)
  .delete(authorization, roleGuard(["admin"]), remove);

commentRouter.route("/:id/reply").post(authorization, reply);

commentRouter
  .route("/:commentID/reply/:replyID")
  .delete(authorization, roleGuard(["admin"]), removeReply)
  .put(authorization, updateReply);

export default commentRouter;
