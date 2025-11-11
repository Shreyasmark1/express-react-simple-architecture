import express from "express";
import { ConfigValidators } from "./config.validator";
import { validateRequest } from "../../lib/middlewares/validator-middleware";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { ConfigControllers } from "./config.controller";

const router = express.Router();

router.route("")
    .post(validateRequest(ConfigValidators.config), catchAsync(ConfigControllers.saveConfig))
    .get(catchAsync(ConfigControllers.getAllConfigs));

export const ConfigRouter = router;