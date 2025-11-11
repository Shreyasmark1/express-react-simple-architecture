import axios from "axios";
import { EnvVariables } from "../../config/env-helper";
import { ApiError } from "../types/api-error";

const send = async (mobileNo: string, msg: string) => {
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('module', 'TRANS_SMS');
    urlEncodedData.append('apikey', EnvVariables.sms.tfa.apiKey);
    urlEncodedData.append('to', "91" + mobileNo);
    urlEncodedData.append('from', EnvVariables.sms.tfa.senderId);
    urlEncodedData.append('msg', msg);

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }

    const response = await axios.post(EnvVariables.sms.tfa.url, urlEncodedData, { headers });

    if (response.status === 200) {
        if (response.data?.Status !== "Success") throw ApiError.internalServerError("Failed to send SMS!");
    } else throw ApiError.internalServerError("Failed to send SMS with status code " + response.status);
}

export const Tfa_SMS = {
    send
}