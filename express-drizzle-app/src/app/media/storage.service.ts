import { AppConstants } from "../../config/app-constants";
import { EnvVariables } from "../../config/env-helper";
import { s3 } from "../../lib/storage/s3";
import { ApiError } from "../../lib/types/api-error";
import { FileUtils } from "../../lib/utils/file-util";
import { StringUtils } from "../../lib/utils/string-util";
import { UUIDUtil } from "../../lib/utils/uuid-generator";
import { ContextType } from "./media.validaor";

const s3Client = s3.createS3Client(
    EnvVariables.storage.s3.region, 
    EnvVariables.storage.s3.accessKeyId,
    EnvVariables.storage.s3.secretAccessKey
)

const s3Util = s3.createS3Util(s3Client)

const getFile = async (path: string) => {

    if (StringUtils.isEmpty(path)) throw ApiError.badRequest('File path is required.');

    return await s3Util.getObjectURL(path);
}

const saveBase64 = async (
    base64: string,
    rootDir: string,
    context: ContextType,
    originalFileName: string,
    contextId: string
) => {
    if (StringUtils.isEmpty(base64)) throw ApiError.badRequest("Empty file data");

    const parts = base64.split(';base64,');

    if (!parts || parts.length !== 2) throw ApiError.badRequest('Invalid Base64 string format. Missing header or data.');

    const mimeType = parts[0]?.substring(parts[0].indexOf(':') + 1);
    const base64Data = parts[1];

    if (StringUtils.isEmpty(mimeType)) throw ApiError.badRequest("Invalid mime type/file type");
    if (StringUtils.isEmpty(base64Data)) throw ApiError.badRequest("Invalid base64 data");

    const uniqueFileName = `${UUIDUtil.generate()}.${FileUtils.getExtension(originalFileName)}`;

    const fullDir = _getFullPath(rootDir, AppConstants.lib.fileSeparator, context, contextId);
    const fullDirWithName = `${fullDir}${AppConstants.lib.fileSeparator}${uniqueFileName}`

    await s3Util.putObjectBase64(base64Data, fullDirWithName, mimeType);

    return {
        url: fullDirWithName
    }
}

const _getFullPath = (rootDir: string, fileSeparator: string, contextType: ContextType, contextId: string) => {

    switch (contextType) {
        case "product-images": {
            if (StringUtils.isEmpty(contextId)) throw ApiError.internalServerError("Invalid product id");
            return `${rootDir}${fileSeparator}${contextId}${fileSeparator}${contextType}`;
        }
        case "user-profile-images": {
            if (StringUtils.isEmpty(contextId)) throw ApiError.internalServerError("Invalid user id");
            return `${rootDir}${fileSeparator}${contextId}${fileSeparator}${contextType}`;
        }
        default: {
            throw ApiError.badRequest("Invalid context type!");
        }
    }
}

export const StorageService = {
    getFile,
    saveBase64
}