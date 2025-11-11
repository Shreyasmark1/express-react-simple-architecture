import jwt, { Secret, Algorithm } from 'jsonwebtoken';

export type JwtSecret = Secret;

type JWTConfig = {
    secret: JwtSecret,
    expiresInMinutes: number,
    defaultAlgorithm?: Algorithm;
}

const generateJWT = (payload: jwt.JwtPayload, secret: Secret, expiresIn: number, algorithm: Algorithm) => {
    return jwt.sign(payload, secret, { expiresIn, algorithm });
};

const verifyJWT = (token: string, secret: Secret, algorithms: Algorithm[]) => {
    try {
        const payload = jwt.verify(token, secret, { algorithms: algorithms }) as jwt.JwtPayload;

        if (typeof payload.sub === 'string') {
            return JSON.parse(payload.sub);
        }

        return payload.sub;
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }
};

const decodeJWT = (token: string) => {
    const decoded = jwt.decode(token);
    // all the data should be in sub
    if (decoded && typeof decoded === 'object' && 'sub' in decoded && typeof decoded.sub === 'string') {
        try {
            return JSON.parse(decoded.sub);
        } catch (e) {
            console.warn("JWT decoding failed:", e);
            return decoded.sub;
        }
    }
    return decoded;
};

// --- Factory function to create the JWT utility with injected config ---
export const createJwtUtil = (config: JWTConfig) => {

    const generateToken = (sub: any) => {

        const expiresAt = config.expiresInMinutes * 60;

        const payload = {
            sub: JSON.stringify(sub),
            iat: Math.floor(Date.now() / 1000),
        };

        return generateJWT(payload, config.secret, expiresAt, config.defaultAlgorithm || 'HS256');
    }

    const verifyToken = (token: string) => verifyJWT(token, config.secret, [config.defaultAlgorithm || 'HS256']);

    return {
        generateToken,
        verifyToken,
        decodeJWT
    };
};