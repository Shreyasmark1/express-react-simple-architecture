import { S3FileStorage } from "./s3";

export const StorageService = {
    uploadBase64: S3FileStorage.putObjectBase64,
    get: S3FileStorage.getObjectURL 
}