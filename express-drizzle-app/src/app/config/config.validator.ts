import { z } from "zod";
import { configKeyValues } from "../../schemas/config.repository";

const configBody = z.object({
    configId: z.string().optional().nullable(),
    key: z.enum(configKeyValues),
    value: z.object({
        type: z.enum(['string', 'number', 'boolean', 'json']),
        value: z.any()
    })
}).strict();

export type Config = z.infer<typeof configBody>;

export const ConfigValidators = {
    config: configBody
}