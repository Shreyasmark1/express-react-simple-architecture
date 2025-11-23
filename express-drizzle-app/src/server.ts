import express, { Request, Response } from "express";
import { corsMiddleware } from "./lib/middlewares/cors-middleware";
import { JWTMiddleWare } from "./lib/middlewares/auth-middleware";
import { ApiError } from "./lib/types/api-error";
import { globalExceptionHandler } from "./lib/middlewares/global-exception-middleware";
import { EnvVariables } from "./config/env-helper";
import { testConnection } from "./lib/db/pg/connection";
import { ApiRouter } from "./app/api.route";
import { AccessTokenUtil } from "./lib/jwt/jwt-token-util";
import { db } from "./config/db";

export async function startServer() {
    const app = express();
    /**
     * Middleware functions are executed in the order they are added to the application.
     *  The order of middleware registration matters and each middleware function can modify the request and response objects
     *  or terminate the request-response cycle.
     */
    app.use(express.json({ limit: "2mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(corsMiddleware());
    app.use(JWTMiddleWare(AccessTokenUtil.verifyToken));

    // routes
    app.get("", __test__)
    app.use("/api", ApiRouter);

    app.use((_req, _res, next) => next(ApiError.notFound('Route not found')));
    app.use(globalExceptionHandler);

    await testConnection(db);

    app.listen(EnvVariables.port, () => console.log(`Server running on PORT: ${EnvVariables.port}!`));
}

const __test__ = (req: Request, res: Response) => {
    const { data } = req.query
    console.log("Request received wth data: " + data);
    res.json({ status: true, message: "Hello world!", data })
}