import { ApiError } from "../types/api-error";
import { StringUtils } from "./string-util";

const getExtension = (filename: string) => {

    if (StringUtils.isEmpty(filename)) throw ApiError.badRequest("Invalid file name");

    const parts = filename.split(".");
    // If there's only one part, there's no extension
    if (parts.length === 1) throw ApiError.badRequest("Invalid file name");
    
    // Otherwise, the last element is the extension
    return parts[parts.length - 1];
};

export const FileUtils = {
    getExtension
}