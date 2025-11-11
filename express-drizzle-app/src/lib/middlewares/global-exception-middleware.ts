import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../constants/http-status';
import { ApiResponse } from '../types/api-response';
import { ApiError } from '../types/api-error';
import { EnvVariables } from '../../config/env-helper';

const leakErrors = !EnvVariables.isProd

export const globalExceptionHandler = (error: ApiError | Error, _req: Request, res: Response, next: NextFunction) => {

    console.error(error)

    let httpCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error: Something went wrong!";

    if (error instanceof ApiError) {

        httpCode = error.httpCode;
        message = error.message;

    } else {

        try {

            // TODO: log error message in db

            if (leakErrors) {
                if (error instanceof Error) {

                    const cause: any = error.cause;

                    message = cause?.message || error.message || message

                } else {
                    if (error) message = JSON.stringify(error);
                }
            }

        } catch (err) {
            message = "An error occurred while processing the error message.";
        }

    }

    res.status(httpCode).json(ApiResponse.failed(message));

}