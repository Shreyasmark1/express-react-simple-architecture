import express from "express";
import { requireAuth } from "../../lib/middlewares/auth-middleware";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { FileUploadController } from "./media.controller";
import { fileUploadSchema } from "./media.validaor";
import { validateRequest } from "../../lib/middlewares/validator-middleware";

const router = express.Router();

// router.use("", express.static(EnvVariables.fileUploadDirectory));

router.get("/image/*path", catchAsync(FileUploadController.getFile));

router.use(requireAuth);
router.post("/image/users", validateRequest(fileUploadSchema), catchAsync(FileUploadController.uploadUserFiles));
router.post("/image/products", validateRequest(fileUploadSchema), catchAsync(FileUploadController.uploadProductFiles));

export const FileUploadRouter = router;