import { EnvVariables } from "../../config/env-helper";
import { UUIDUtil } from "./uuid-generator";

type TokenGenerator = (sub: any) => string

export const OTP_LENGTH = 4;

const generateOtpWithTransactionToken = (expirationInMinutes: number, tokenGenerator: TokenGenerator) => {

    const otp = _generateOTP();
    const expiresAt = new Date(Date.now() + expirationInMinutes * 60000);
    const token = UUIDUtil.generate();

    return {
        otp,
        expiresAt,
        token,
        transactionToken: tokenGenerator({ token })
    }
}

function _generateOTP() {
    if (EnvVariables.isProd) {
        // Generates a random integer between 1000 and 9999 inclusive
        return Math.floor(1000 + Math.random() * 9000).toString();
    } else {
        return "1234"
    }
}

export const OtpUtil = {
    generateOtpWithTransactionToken
}