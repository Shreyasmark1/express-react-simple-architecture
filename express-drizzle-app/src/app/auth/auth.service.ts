import { and, eq } from "drizzle-orm";
import { Tnx, withTransaction } from "../../lib/db/pg/transaction";
import { ApiError } from "../../lib/types/api-error";
import { UserInsert, users } from "../../schemas/user.repository";
import { OtpUtil } from "../../lib/utils/otp-util";
import { AppConstants } from "../../config/app-constants";
import { AccessTokenUtil, TransactionTokenUtil } from "../../lib/jwt/jwt-token-util";
import { otpAuths } from "../../schemas/auth.repository";
import { EnvVariables } from "../../config/env-helper";
import { SMSService } from "../../lib/sms";
import { ChangePassword, ForgotPassword, Login, Register, ResetPassword } from "./auth.validator";
import { StringUtils } from "../../lib/utils/string-util";
import { PasswordUtil } from "../../lib/utils/password-util";
import { wallets } from "../../schemas/wallet.repository";
import { db } from "../../lib/db/pg/connection";
import { schedulerJobs, SchedulerJobsInsert } from "../../schemas/scheduler.repository";

const sendOtpToMe = async (tnx: Tnx, userId: string) => {

    const user = await tnx.query.users.findFirst({
        where: eq(users.userId, userId)
    })

    if (!user) throw ApiError.internalServerError("User not found");

    return await sendOtp(tnx, user.mobileNo, user.userId);
}

const sendOtp = async (tnx: Tnx, mobileNo: string, userId?: string) => {

    const { otp, expiresAt, token, transactionToken } = OtpUtil.generateOtpWithTransactionToken(AppConstants.otpExpiresInMinutes, TransactionTokenUtil.generateToken);

    await tnx.insert(otpAuths).values({ mobileNo, otp, expiresAt, token, isExpired: false, userId }).returning()

    if (EnvVariables.isProd) await SMSService.sendOtp(mobileNo, otp);

    return { transactionToken, expiresInMinutes: AppConstants.otpExpiresInMinutes, mobileNo }
}

const validateOtp = async (tnx: Tnx, otp: string, transactionToken: string, mobileNo: string) => {
    const { authLog, verified } = await _verifyOtp(tnx, transactionToken, otp);

    if (authLog.mobileNo !== mobileNo) throw ApiError.badRequest("Invalid OTP!");

    return { isValid: verified }
}

const register = async (tnx: Tnx, body: Register) => {

    const { userId } = await _verifyOtpAndMarkExpired(tnx, body.transactionToken, body.otp, body.mobileNo);

    if (StringUtils.isNotEmpty(userId)) throw ApiError.badRequest("Invalid request cannot verify otp");

    const userData: UserInsert = {
        username: body.username,
        passwordHash: await PasswordUtil.hashPassword(body.password),
        mobileNo: body.mobileNo,
        email: body.email
    }

    const [user] = await tnx.insert(users).values(userData).returning();

    if (!user) throw ApiError.internalServerError("Error while creating user");

    const [wallet] = await tnx.insert(wallets).values({
        userId: user.userId,
        currentBalance: '0'
    }).returning();

    if (!wallet) throw ApiError.internalServerError("Error while creating wallet");

    const registerJob: SchedulerJobsInsert = {
        contextId: user.userId,
        jobContext: 'on_register'
    }

    await tnx.insert(schedulerJobs).values(registerJob);

    const accessToken = AccessTokenUtil.generateToken({ userId: user.userId, role: "member" });

    // prevent hashed password from leaking to client
    const { passwordHash, ...userDetail } = user;

    return { accessToken, user: userDetail };
}

const login = async (body: Login) => {

    const { email, password } = body

    const user = await db.query.users.findFirst({
        where: () => and(eq(users.email, email), eq(users.role, "user"))
    });

    if (!user) throw ApiError.notFound("User not found!")

    const isPasswordMatch = await PasswordUtil.comparePasswords(password, user.passwordHash)
    if (!isPasswordMatch) throw ApiError.badRequest("Invalid credentials");

    const accessToken = AccessTokenUtil.generateToken({ userId: user.userId, role: user.role })

    // prevent hashed password from leaking to client
    const { passwordHash, ...userDetail } = user;

    return { accessToken, user: userDetail }
}

const changePassword = async (body: ChangePassword, userId: string) => {

    const { newPassword, currentPassword } = body

    const user = await db.query.users.findFirst({
        where: () => eq(users.userId, userId)
    });

    if (!user) throw ApiError.badRequest("User not found");

    const isPasswordMatch = await PasswordUtil.comparePasswords(currentPassword, user.passwordHash)
    if (!isPasswordMatch) throw ApiError.badRequest("This password doesn't match with your current password");

    const [updatedUser] = await db.update(users)
        .set({ passwordHash: await PasswordUtil.hashPassword(newPassword) })
        .where(eq(users.userId, user.userId))
        .returning()

    if (!updatedUser) throw ApiError.internalServerError("Error updating passowrd");

    return { userId: updatedUser.userId }
}

const forgotPassword = async (tnx: Tnx, body: ForgotPassword) => {

    const user = await tnx.query.users.findFirst({ where: () => eq(users.email, body.email) });

    if (!user) throw ApiError.badRequest("User not found with this ID");

    return sendOtp(tnx, user.mobileNo, user.userId);
}

const resetPassword = async (tnx: Tnx, body: ResetPassword) => {
    const { otp, newPassword, transactionToken } = body

    const { userId } = await _verifyOtpAndMarkExpired(tnx, transactionToken, otp, "");

    if (!userId) throw ApiError.badRequest("User not found!");

    const [updatedUser] = await db.update(users)
        .set({ passwordHash: await PasswordUtil.hashPassword(newPassword) })
        .where(eq(users.userId, userId))
        .returning()

    if (!updatedUser) throw ApiError.internalServerError("Error updating passowrd");

    return { userId: updatedUser.userId };
}

const _verifyOtpAndMarkExpired = async (tnx: Tnx, transactionToken: string, otp: string, mobileNo: string,) => {

    const { authLog, verified } = await _verifyOtp(tnx, transactionToken, otp);

    if (StringUtils.isNotEmpty(mobileNo)) {
        if (authLog.mobileNo !== mobileNo) throw ApiError.notFound("Invalid OTP!");
    } else if (StringUtils.isEmpty(authLog.userId)) {
        throw ApiError.notFound("User not found")
    }

    await tnx.update(otpAuths).set({ isExpired: true }).where(eq(otpAuths.authId, authLog.authId));

    return { userId: authLog.userId, verified };
}

const _verifyOtp = async (tnx: Tnx, transactionToken: string, otp: string) => {

    const sub = TransactionTokenUtil.verifyToken(transactionToken);

    if (!sub || StringUtils.isEmpty(sub.token)) throw ApiError.badRequest("OTP Expired!");

    const authLog = await tnx.query.otpAuths.findFirst({ where: () => eq(otpAuths.token, sub.token) })

    if (!authLog) throw ApiError.badRequest("OTP Expired!");

    if (authLog.otp !== otp) throw ApiError.badRequest("Invalid OTP!");
    if (authLog.isExpired) throw ApiError.badRequest("OTP Expired!");

    return { authLog, verified: true }
}

export const AuthService = {
    sendOtp: withTransaction(sendOtp),
    sendOtpToMe: withTransaction(sendOtpToMe),
    validateOtp: withTransaction(validateOtp),
    register: withTransaction(register),
    login,
    changePassword,
    forgotPassword: withTransaction(forgotPassword),
    resetPassword: withTransaction(resetPassword),
    _verifyOtpAndMarkExpired
}