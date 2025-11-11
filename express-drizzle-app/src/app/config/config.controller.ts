import { Request, Response } from "express";
import { ApiResponse } from "../../lib/types/api-response";
import { ConfigService } from "./config.service";

const saveConfig = async (req: Request, res: Response) => {
    const config = req.body;
    const responseData = await ConfigService.saveConfig(config);
    res.json(ApiResponse.send(responseData));
};

const getAllConfigs = async (req: Request, res: Response) => {
    const responseData = await ConfigService.getAllConfigs();
    res.json(ApiResponse.send(responseData));
};

export const ConfigControllers = {
    saveConfig,
    getAllConfigs
};