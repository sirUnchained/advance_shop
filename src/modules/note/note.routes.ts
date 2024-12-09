import { Router } from "express";
const noteRouter = Router();

import {
  getAll,
  addNote,
  getNote,
  editNote,
  removeNote,
} from "./note.controller";
import authorization from "../../middleWares/auth.middleWare";

noteRouter.route("/").get(authorization, getAll).post(authorization, addNote);
noteRouter.route("/:noteID").get(authorization, getNote);
noteRouter.route("/:noteID").put(authorization, editNote);
noteRouter.route("/:noteID").delete(authorization, removeNote);

export default noteRouter;
