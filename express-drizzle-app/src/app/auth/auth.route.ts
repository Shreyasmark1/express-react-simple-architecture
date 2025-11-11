import express from "express";
import { validateRequest } from "../../lib/middlewares/validator-middleware";
import { AuthValidators } from "./auth.validator";
import { requireAuth } from "../../lib/middlewares/auth-middleware";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { AuthControllers } from "./auth.controller";

const router = express.Router();

// unauthenticated
router.post("/send-otp", validateRequest(AuthValidators.sendOtp), catchAsync(AuthControllers.sendOtp));
router.post("/verify-otp", validateRequest(AuthValidators.verifyOtp), catchAsync(AuthControllers.validateOtp));
router.post("/register", validateRequest(AuthValidators.register), catchAsync(AuthControllers.register));
router.post("/login", validateRequest(AuthValidators.login), catchAsync(AuthControllers.login));
router.post("/password/forgot", validateRequest(AuthValidators.forgotPassword), catchAsync(AuthControllers.forgotPassword));
router.post("/password/forgot/reset", validateRequest(AuthValidators.resetPassword), catchAsync(AuthControllers.resetPassword));

// authenticated
router.use(requireAuth)
router.post("/password/change", validateRequest(AuthValidators.changePassword), catchAsync(AuthControllers.changePassword));
router.post("/send-otp/me", catchAsync(AuthControllers.sendOtpToMe))

export const AuthRouter = router;