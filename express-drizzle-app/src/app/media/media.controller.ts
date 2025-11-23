import { Request, Response } from "express";
import { Readable } from "stream";
import { MediaService } from "./media.service";
import { ApiResponse } from "../../lib/types/api-response";
import { ApiError } from "../../lib/types/api-error";
import { StringUtils } from "../../lib/utils/string-util";

const uploadUserFiles = async (req: Request, res: Response) => {

    const response = await MediaService.uploadUserFiles(req.body);
    res.json(ApiResponse.send(response));
};

const uploadProductFiles = async (req: Request, res: Response) => {

    const response = await MediaService.uploadProductFiles(req.body);
    res.json(ApiResponse.send(response));
};

const getFile = async (req: Request, res: Response) => {

    if (StringUtils.isEmpty(req.url)) throw ApiError.badRequest("Invalid path!");

    const { Body, ContentType } = await MediaService.getFile(req.url);

    if (Body instanceof Readable) {
        
        res.setHeader('Content-Type', ContentType || 'image/jpeg');

        Body.pipe(res);
    } else {
        throw ApiError.internalServerError("Body is not readable stream!");
    }

}

export const FileUploadController = {
    uploadProductFiles,
    uploadUserFiles,
    getFile
};
