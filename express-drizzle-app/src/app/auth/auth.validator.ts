import { z } from "zod";
import { mobileNoSchema } from "../../lib/zod/zod-schemas";

const sendOtpBody = z.object({
    mobileNo: mobileNoSchema,
}).strict()

const verifyOtpBody = z.object({
    mobileNo: mobileNoSchema,
    otp: z.string({ message: "Invalid OTP!" }),
    transactionToken: z.string({ message: "Invalid transaction token" }).nonempty({ message: "Invalid transaction token" }),
}).strict()

const registerBody = z.object({
    username: z.string().nonempty(),
    mobileNo: mobileNoSchema,
    password: z.string().nonempty(),
    email: z.string().nonempty(),
    otp: z.string().nonempty(),
    transactionToken: z.string({ message: "Invalid transaction token" }).nonempty({ message: "Invalid transaction token" }),
}).strict()

const loginBody = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
}).strict()

const changePasswordBody = z.object({
    currentPassword: z.string().nonempty(),
    newPassword: z.string().nonempty()
}).strict()

const forgotPasswordBody = z.object({
    email: z.string().nonempty()
}).strict()

const resetPasswordBody = z.object({
    otp: z.string().nonempty(),
    newPassword: z.string().nonempty(),
    transactionToken: z.string().nonempty(),
}).strict()

export type ForgotPassword = z.infer<typeof forgotPasswordBody>
export type ResetPassword = z.infer<typeof resetPasswordBody>
export type ChangePassword = z.infer<typeof changePasswordBody>
export type Register = z.infer<typeof registerBody>
export type Login = z.infer<typeof loginBody>
export type VerifyOtp = z.infer<typeof verifyOtpBody>
export type SendOtp = z.infer<typeof sendOtpBody>

export const AuthValidators = {
    sendOtp: sendOtpBody,
    verifyOtp: verifyOtpBody,
    register: registerBody,
    login: loginBody,
    changePassword: changePasswordBody,
    forgotPassword: forgotPasswordBody,
    resetPassword: resetPasswordBody
}
