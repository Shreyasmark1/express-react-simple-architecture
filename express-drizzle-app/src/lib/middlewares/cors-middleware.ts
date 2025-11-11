import cors from "cors";

export const corsMiddleware = () => {
    return cors({
        credentials: true,
        origin: '*',
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        methods: ['GET', 'POST'],
        maxAge: 600
    })
}
