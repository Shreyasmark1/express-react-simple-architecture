import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { EnvVariables } from "../../config/env-helper";
import { ApiError } from "../types/api-error";

const s3Client = new S3Client({
    region: EnvVariables.storage.s3.region,
    credentials: {
        accessKeyId: EnvVariables.storage.s3.accessKeyId,
        secretAccessKey: EnvVariables.storage.s3.secretAccessKey
    }
});

const putObjectBase64 = async (base64Data: string, key: string, mimeType: string) => {
    try {

        const buffer = Buffer.from(base64Data, 'base64');

        const command = new PutObjectCommand({
            Bucket: EnvVariables.storage.s3.bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType
        });

        const data = await s3Client.send(command);

    } catch (error) {
        console.error(error);
        throw ApiError.internalServerError("Failed to upload file!")
    }
}

const getObjectURL = async (key: string) => {
    try {

        const command = new GetObjectCommand({
            Bucket: EnvVariables.storage.s3.bucket,
            Key: key
        });

        return await s3Client.send(command);

    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            if (error.name === 'NoSuchKey') throw ApiError.notFound('Image not found.');
        }

        throw ApiError.internalServerError("Failed to upload file!")
    }
}

export const S3FileStorage = {
    putObjectBase64,
    getObjectURL
}

