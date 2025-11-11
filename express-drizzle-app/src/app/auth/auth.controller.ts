import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../lib/types/api-response";
import { ApiError } from "../../lib/types/api-error";
import { StringUtils } from "../../lib/utils/string-util";

const sendOtpToMe = async (req: Request, res: Response) => {
    const responseData = await AuthService.sendOtpToMe(req.getUserSession().getUserId());
    res.json(ApiResponse.send(responseData))
}

const sendOtp = async (req: Request, res: Response) => {
    
    const { mobileNo } = req.body

    if (StringUtils.isEmpty(mobileNo)) throw ApiError.badRequest("Invalid mobile number!");

    const responseData = await AuthService.sendOtp(mobileNo);
    res.json(ApiResponse.send(responseData))
}

const validateOtp = async (req: Request, res: Response) => {

    const { otp, transactionToken, mobileNo } = req.body

    const responseData = await AuthService.validateOtp(otp, transactionToken, mobileNo);
    res.json(ApiResponse.send(responseData));
}

const register = async (req: Request, res: Response) => {
    const responseData = await AuthService.register(req.body)
    res.json(ApiResponse.send(responseData))
}

const login = async (req: Request, res: Response) => {
    const responseData = await AuthService.login(req.body)
    res.json(ApiResponse.send(responseData))
}

const changePassword = async (req: Request, res: Response) => {
    const userId = req.getUserSession().getUserId();
    
    await AuthService.changePassword(req.body, userId);
    res.json(ApiResponse.send());
}

const forgotPassword = async (req: Request, res: Response) => {
    const responseData = await AuthService.forgotPassword(req.body)
    res.json(ApiResponse.send(responseData))
}

const resetPassword = async (req: Request, res: Response) => {
    const responseData = await AuthService.resetPassword(req.body);
    res.json(ApiResponse.send(responseData));
}

export const AuthControllers = {
    sendOtp,
    validateOtp,
    register,
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    sendOtpToMe
}