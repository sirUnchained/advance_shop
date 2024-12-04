import { Router } from "express";
const authRoutes = Router();

import { send, verify, getMe } from "./auth.controller";
import authorization from "../../middleWares/auth.middleWare";

authRoutes.route("/send").post(send);
authRoutes.route("/verify").post(verify);
authRoutes.route("/getMe").get(authorization, getMe);

export default authRoutes;
