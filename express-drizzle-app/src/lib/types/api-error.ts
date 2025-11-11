import { HttpStatus } from "../constants/http-status";

export class ApiError extends Error {

    readonly httpCode: number;

    constructor(message: string, httpCode: number) {
        super(message);

        this.httpCode = httpCode;

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    public static badRequest(message = 'Bad Request'): ApiError {
        return new ApiError(message, HttpStatus.BAD_REQUEST);
    }

    public static internalServerError(message = 'Internal Server Error'): ApiError {
        return new ApiError(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static notFound(memssage = "Not found"): ApiError {
        return new ApiError(memssage, HttpStatus.NOT_FOUND);
    }
}