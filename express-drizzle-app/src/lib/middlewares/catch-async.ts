import { NextFunction, Request, Response } from "express";

type fnType = (req: Request, res: Response, next: NextFunction) => Promise<any>

export const catchAsync = (fn: fnType) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch((err) => next(err));