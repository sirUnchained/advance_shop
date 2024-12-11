import { Router } from "express";
const cartRouter = Router();

import { getItemsInCart, addToCart, removeFromCart } from "./cart.controller";
import authorization from "../../middleWares/auth.middleWare";

cartRouter
  .route("/")
  .get(authorization, getItemsInCart)
  .post(authorization, addToCart)
  .delete(authorization, removeFromCart);

export default cartRouter;
