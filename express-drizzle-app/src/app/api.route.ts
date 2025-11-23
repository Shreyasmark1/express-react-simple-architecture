import express from "express";
import { AuthRouter } from "./auth/auth.route";
import { UserRouter } from "./user/user.route";
import { requireAuth, requireRole } from "../lib/middlewares/auth-middleware";
import { ConfigRouter } from "./config/config.route";

const router = express.Router();

router.use("/v1/auth", AuthRouter)

router.use(requireAuth)
router.use("/v1/user", UserRouter)

router.use(requireRole(['admin']))
router.use("/v1/config", ConfigRouter)

export const ApiRouter = router;