import { ZodSchema } from "zod";
import { HttpStatus } from "../constants/http-status";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../types/api-error";
import { validateSchema } from "../zod/zod-validation";

export const validateRequest = (schema: ZodSchema) => async (req: Request, _res: Response, next: NextFunction) => {

    const result = await validateSchema(schema, req.body);

    if (!result.success) {
        return next(new ApiError(result.errorMessages, HttpStatus.BAD_REQUEST));
    }

    return next();
};

