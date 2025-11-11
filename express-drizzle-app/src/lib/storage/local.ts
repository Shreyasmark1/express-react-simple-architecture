import fs from 'fs/promises';
import path from 'path';
import { EnvVariables } from '../../config/env-helper';

const getFileUploadDirectory = (): string => {
    return EnvVariables.storage.local.fileUploadDirectory;
}

const base64Upload = async (base64Data: string, subDir: string, newFileName: string) => {

    const fullUploadPath = path.join(getFileUploadDirectory(), subDir);
    const filePath = path.join(fullUploadPath, newFileName);

    await fs.mkdir(fullUploadPath, { recursive: true });

    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, buffer);

}

export const LocalFileStorage = {
    base64Upload
}