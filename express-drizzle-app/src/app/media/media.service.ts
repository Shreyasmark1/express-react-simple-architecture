import { AppConstants } from "../../config/app-constants";
import { ApiError } from "../../lib/types/api-error";
import { StringUtils } from "../../lib/utils/string-util";
import { FileUpload } from "./media.validaor";
import { StorageService } from "./storage.service";

const uploadUserFiles = (body: FileUpload) => {

    let rootDir = ""

    const sep = AppConstants.lib.fileSeparator;
    const dirs = AppConstants.lib.dirs;

    switch (body.contextType) {
        case "user-profile-images":
            rootDir = `${dirs.images}${sep}${dirs.users}`
            break;
        default:
            break;
    }

    if (StringUtils.isEmpty(rootDir)) throw ApiError.badRequest("Something went wrong!");

    return StorageService.saveBase64(
        body.base64,
        rootDir,
        body.contextType,
        body.fileName,
        body.contextId
    );
}

const uploadProductFiles = (body: FileUpload) => {

    let rootDir = ""

    const sep = AppConstants.lib.fileSeparator;
    const dirs = AppConstants.lib.dirs;

    switch (body.contextType) {
        case "product-images":
            rootDir = `${dirs.images}${sep}${dirs.products}`
            break;
        default:
            break;
    }

    if (StringUtils.isEmpty(rootDir)) throw ApiError.badRequest("Something went wrong!");

    return StorageService.saveBase64(
        body.base64,
        rootDir,
        body.contextType,
        body.fileName,
        body.contextId
    );
}

const getFile = async (path: string) => {

    if (StringUtils.isEmpty(path)) throw ApiError.badRequest('File path is required.');

    return await StorageService.getFile(path);
}


export const MediaService = {
    uploadProductFiles,
    uploadUserFiles,
    getFile
};