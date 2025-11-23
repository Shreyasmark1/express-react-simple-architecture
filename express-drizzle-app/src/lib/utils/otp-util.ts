import { UUIDUtil } from "./uuid-generator";

type TransactionTokenGenerator = (sub: any) => string

const generateOtpTransactionToken = (
    otp: string,
    expirationInMinutes: number,
    transactionTokenGenerator: TransactionTokenGenerator
) => {

    const expiresAt = new Date(Date.now() + expirationInMinutes * 60000);
    const token = UUIDUtil.generate();

    return {
        otp,
        expiresAt,
        token,
        transactionToken: transactionTokenGenerator({ token })
    }
}

function generateOTP(isTest: boolean) {

    if (isTest) return "1234"

    // Generates a random integer between 1000 and 9999 inclusive
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const createOtpUtil = (isTest?: boolean) => ({
    generateOtpTransactionToken,
    generateOTP: generateOTP(isTest || false)
})