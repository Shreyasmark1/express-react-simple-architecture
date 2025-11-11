import { v2 as cloudinary } from 'cloudinary';
import { EnvVariables } from '../../config/env-helper';

cloudinary.config({
    cloud_name: EnvVariables.storage.cloudinary.cloudName,
    api_key: EnvVariables.storage.cloudinary.apiKey,
    api_secret: EnvVariables.storage.cloudinary.apiSecret
});

const upload = async (base64StringFile: string) => {

    const result = await cloudinary.uploader.upload(base64StringFile, {
        resource_type: 'auto'
    });

    return result.secure_url;
}

export const Cloudinary = {
    upload
}