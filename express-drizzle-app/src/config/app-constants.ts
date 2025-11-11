import { AppGlobalConstants } from "../lib/constants/app-global-constants";

const otpLength = 4;
const otpExpiresInMinutes = 5; // 5 minutes
const transactionTokenExpiresInMinutes = 5; // 5 minutes
const accessTokenExpiresInMinutes = 60 * 1; // 1 hour
const refreshTokenExpiresInMinutes = 60 * 24; // 1 day
const fileSeparator = "/";

export const AppConstants = {
    otpLength,
    otpExpiresInMinutes,
    accessTokenExpiresInMinutes,
    refreshTokenExpiresInMinutes,
    transactionTokenExpiresInMinutes,
    fileSeparator,
    ...AppGlobalConstants
};
