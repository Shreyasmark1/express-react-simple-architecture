import { StringUtils } from "../utils/string-util";
import { HttpStatus } from "../constants/http-status";
import { Request, NextFunction, Response } from "express";
import { Session } from "../types/user-session";
import { ApiError } from "../types/api-error";
import { UserRoles } from "../db/pg/schema";

type JwtVerifyer = (token: string) => any

export const JWTMiddleWare = (validator: JwtVerifyer) => (req: HttpRequest, _res: Response, next: NextFunction) => {

    try {

        delete req.x_app_internal_session // prevent forgery
        req.getUserSession = _getUserSession // setting custom getter function for accessing the session

        const authHeader = req.headers?.authorization
        const token = authHeader && authHeader.split(' ')[1] // 'Bearer xkjsdjhs...' - removes 'Brearer ' prefix

        if (StringUtils.isNotEmpty(token)) {

            const sub = validator(token);

            if (sub) req.x_app_internal_session = Session.setAuth(sub.userId, sub.role);

        }

    } catch (error) {
        return next(error)
    }

    next()
}

const _getUserSession = function (this: HttpRequest): Session {

    if (this.x_app_internal_session && this.x_app_internal_session instanceof Session) {
        if (StringUtils.isNotEmpty(this.x_app_internal_session.getUserId())) {
            return this.x_app_internal_session;
        }
    }
    
    throw new ApiError("Not Authenticated!", HttpStatus.UNAUTHORIZED);
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {

    if (!req.getUserSession) {
        return next(new ApiError('You require full authentication to access this resource', HttpStatus.UNAUTHORIZED));
    }

    const session = req.getUserSession();

    // add validation here if getUserSession can retun value even when not authenticated
    // see _getUserSession function above

    next()
}


export const requireRole = (roles: UserRoles[]) => (req: Request, _res: Response, next: NextFunction) => {

    const session = req.getUserSession();
    const role = session.getUserRole();

    if (!roles.includes(role)) {
        return next(new ApiError("You don't have the permission to perform this action", HttpStatus.UNAUTHORIZED));
    }

    next();
}

// session can be tampered by middleware that's why only in this file creating this interface
interface HttpRequest extends Request {
    x_app_internal_session?: Session,
    getUserSession: any
}