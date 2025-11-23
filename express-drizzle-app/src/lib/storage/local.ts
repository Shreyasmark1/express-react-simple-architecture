import fs from 'fs/promises';
import path from 'path';

const base64Upload = async (fileUploadDir: string, base64Data: string, subDir: string, newFileName: string) => {

    const fullUploadPath = path.join(fileUploadDir, subDir);
    const filePath = path.join(fullUploadPath, newFileName);

    await fs.mkdir(fullUploadPath, { recursive: true });

    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(filePath, buffer);

}

export const createLocalStorageUtil = (fileUploadDirectory: string) => ({
    saveBase64: _withFileUploadDir(fileUploadDirectory, base64Upload)
})

type FnWithUploadDir<TArgs extends any[], TReturn> = (fileUploadDir: string, ...args: TArgs) => Promise<TReturn>;

const _withFileUploadDir = <TArgs extends any[], TReturn>(
    fileUploadDir: string,
    fn: FnWithUploadDir<TArgs, TReturn>
) => {

    return (...args: TArgs): Promise<TReturn> => {
        return Promise.resolve(fn(fileUploadDir, ...args))
    };
};