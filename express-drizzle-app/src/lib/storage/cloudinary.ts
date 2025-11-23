import { v2 as Cloudinary } from 'cloudinary';

const upload = async (client: CloudinaryClient, base64StringFile: string) => {

    const result = await client.uploader.upload(base64StringFile, {
        resource_type: 'auto'
    });

    return result.secure_url;
}

const createCloudinaryClient = (cloudName: string, apiKey: string, apiSecret: string) => {
    Cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });

    return cloudinary;
}

const createS3Util = (client: CloudinaryClient) => ({
    uploadBase64: _withCloudinaryClient(client, upload),
});

export const cloudinary = {
    createCloudinaryClient,
    createS3Util
}


type CloudinaryClient = typeof Cloudinary

type FnWithCloudinaryClient<TArgs extends any[], TReturn> = (client: CloudinaryClient, ...args: TArgs) => Promise<TReturn>;

const _withCloudinaryClient = <TArgs extends any[], TReturn>(
    cloudinaryClient: CloudinaryClient,
    fn: FnWithCloudinaryClient<TArgs, TReturn>
) => {

    return (...args: TArgs): Promise<TReturn> => {
        return Promise.resolve(fn(cloudinaryClient, ...args))
    };
};