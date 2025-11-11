import express from "express";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { UserContoller } from "./user.controller";
import { validateRequest } from "../../lib/middlewares/validator-middleware";
import { UserValidators } from "./user.validator";
import { requireRole } from "../../lib/middlewares/auth-middleware";

const router = express.Router();

router.get("", requireRole(['user']), catchAsync(UserContoller.getAllUsers));
router.post("/me/wallets", catchAsync(UserContoller.getMyWallet));

// dynamic urls show be in last always or there can be unexpected behaviour
router.get("/:userId", catchAsync(UserContoller.getUser));
router.post("/:userId", validateRequest(UserValidators.update), catchAsync(UserContoller.updateUser));

export const UserRouter = router;