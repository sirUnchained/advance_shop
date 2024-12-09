import { Router } from "express";
const shortLinkRouter = Router();

import { get } from "./shortLink.controller";

shortLinkRouter.route("/:link").get(get);

export default shortLinkRouter;
