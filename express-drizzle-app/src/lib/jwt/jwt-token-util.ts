import { createJwtUtil } from "./jwt-util";
import { AppConstants } from "../../config/app-constants";
import { EnvVariables } from "../../config/env-helper";

export const AccessTokenUtil = createJwtUtil({
    secret: EnvVariables.accessTokenSecret,
    expiresInMinutes: AppConstants.accessTokenExpiresInMinutes,
});

export const TransactionTokenUtil = createJwtUtil({
    secret: EnvVariables.transactionTokenSecret,
    expiresInMinutes: AppConstants.transactionTokenExpiresInMinutes
})
