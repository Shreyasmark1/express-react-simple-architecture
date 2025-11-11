import { EnvVariables } from "../../config/env-helper";
import { ApiError } from "../types/api-error";
import { StringUtils } from "../utils/string-util";
import { Tfa_SMS } from "./2fa-sms";

const sendOtp = async (mobileNo: string, otp: string) => {

    const msg = EnvVariables.sms.tfa.templates.otp.replace('{#var#}', otp);

    if (StringUtils.isEmpty(mobileNo)) throw ApiError.internalServerError("Invalid mobile no for sending SMS!");
    if (!EnvVariables.isProd && mobileNo === "1234567890") return;

    return Tfa_SMS.send(mobileNo, msg)
}

export const SMSService = {
    sendOtp
}