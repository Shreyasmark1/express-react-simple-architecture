import { eq } from "drizzle-orm";
import { HttpStatus } from "../../lib/constants/http-status";
import { db } from "../../lib/db/pg/connection";
import { ApiError } from "../../lib/types/api-error";
import { StringUtils } from "../../lib/utils/string-util";
import { configs } from "../../schemas/config.repository";
import { Config } from "./config.validator";

const _updateConfig = async ({ configId, ...configData }: Config) => {
    if (StringUtils.isEmpty(configId)) throw new ApiError("Invalid appConfig id", HttpStatus.BAD_REQUEST);

    const [appConfig] = await db.update(configs)
        .set(configData)
        .where(eq(configs.configId, configId))
        .returning();

    if (!appConfig) throw new ApiError("App config not found with this id", HttpStatus.NOT_FOUND);

    return { appConfig };
};

const saveConfig = async (body: Config) => {
    return await _updateConfig(body);
};

const getAllConfigs = async () => {
    const configs = await db.query.configs.findMany();
    return { configs };
};

export const ConfigService = {
    saveConfig,
    getAllConfigs
};