import { Router } from "express";
const productRouter = Router();

// import { create, remove, edit } from "./product.controller";
import authorization from "../../middleWares/auth.middleWare";
import roleGuard from "../../middleWares/roleGuard.middleWare";
import multerStorage from "../../utils/uploader";

export default productRouter;
