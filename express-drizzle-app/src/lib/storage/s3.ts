import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { EnvVariables } from "../../config/env-helper";
import { ApiError } from "../types/api-error";

const putObjectBase64 = async (client: S3Client, base64Data: string, key: string, mimeType: string) => {
    try {

        const buffer = Buffer.from(base64Data, 'base64');

        const command = new PutObjectCommand({
            Bucket: EnvVariables.storage.s3.bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType
        });

        return await client.send(command);

    } catch (error) {
        throw ApiError.internalServerError("Failed to upload file!")
    }
}

const getObjectURL = async (client: S3Client, key: string) => {
    try {

        const command = new GetObjectCommand({
            Bucket: EnvVariables.storage.s3.bucket,
            Key: key
        });

        return await client.send(command);

    } catch (error) {

        if (error instanceof Error) {
            if (error.name === 'NoSuchKey') throw ApiError.notFound('Image not found.');
        }

        throw ApiError.internalServerError("Failed to upload file!")
    }
}

const createS3Client = (region: string, accessKeyId: string, secretAccessKey: string) => {
    return new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey }
    });
}

const createS3Util = (client: S3Client) => ({
    putObjectBase64: _withS3Clinent(client, putObjectBase64),
    getObjectURL: _withS3Clinent(client, getObjectURL)
});

export const s3 = {
    createS3Client,
    createS3Util
}

type FnWithS3Client<TArgs extends any[], TReturn> = (client: S3Client, ...args: TArgs) => Promise<TReturn>;

const _withS3Clinent = <TArgs extends any[], TReturn>(
    s3Client: S3Client,
    fn: FnWithS3Client<TArgs, TReturn>
) => {

    return (...args: TArgs): Promise<TReturn> => {
        return Promise.resolve(fn(s3Client, ...args))
    };
};

