import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ApiResponse } from "../../lib/types/api-response";
import { StringUtils } from "../../lib/utils/string-util";
import { ApiError } from "../../lib/types/api-error";

const getAllUsers = async (req: Request, res: Response) => {

    const pageNumber = parseInt(req.query.pageNumber as string || '1', 10);
    const recLimit = parseInt(req.query.recLimit as string || '0', 10);
    const search = req.query.search as string;

    // if (req.query.intValue) currentLevel = parseInt(req.query.intValue as string);

    const responseData = await UserService.getAllUsers(pageNumber, recLimit, search);
    res.json(ApiResponse.send(responseData));
};

const getUser = async (req: Request, res: Response) => {

    const userId = req.params.userId as string;
    if (StringUtils.isEmpty(userId)) throw ApiError.badRequest("Invalid user id");

    const responseData = await UserService.getUser(userId);
    res.json(ApiResponse.send(responseData))
}

const updateUser = async (req: Request, res: Response) => {

    const userId = req.params.userId as string;
    if (StringUtils.isEmpty(userId)) throw ApiError.badRequest("Invalid user id");

    const responseData = await UserService.updateUser(req.body, userId);
    res.json(ApiResponse.send(responseData))
}

const getMyWallet = async (req: Request, res: Response) => {

    const session = req.getUserSession();

    const responseData = await UserService.getWalletByUserId(session.getUserId());
    res.json(ApiResponse.send(responseData));
}

export const UserContoller = {
    getAllUsers,
    getUser,
    updateUser,
    getMyWallet
}