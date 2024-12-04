import { Router } from "express";
const categoryRoutes = Router();

import { create, remove, edit } from "./category.controller";
import {
  createSubCat,
  removeSubCat,
  editSubCat,
} from "./../subCategory/subCategory.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";
import multerStorage from "../../utils/uploader";

const uploader = multerStorage("public/photos/category_icons", false);

categoryRoutes
  .route("/")
  .post(authorization, roleGuard(["admin"]), uploader.single("icon"), create);
categoryRoutes
  .route("/:id")
  .delete(authorization, roleGuard(["admin"]), remove)
  .put(authorization, roleGuard(["admin"]), uploader.single("icon"), edit);

categoryRoutes
  .route("/subCategory")
  .post(
    authorization,
    roleGuard(["admin"]),
    uploader.single("icon"),
    createSubCat
  );
categoryRoutes
  .route("/subCategory/:id")
  .delete(authorization, roleGuard(["admin"]), removeSubCat)
  .put(
    authorization,
    roleGuard(["admin"]),
    uploader.single("icon"),
    editSubCat
  );

export default categoryRoutes;
