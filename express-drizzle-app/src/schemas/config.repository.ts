import { json, pgTable, pgEnum } from "drizzle-orm/pg-core";
import { defaultTimestamps, primaryKey } from "../lib/db/pg/util";

export type ConfigValue =
    | { type: 'string'; value: string }
    | { type: 'number'; value: number }
    | { type: 'boolean'; value: boolean }
    | { type: 'json'; value: any };

export const configKey = pgEnum('config_key', ['allow_registration']);

export const configs = pgTable('config', {
    configId: primaryKey('app_config_id'),
    key: configKey('key').notNull(),
    value: json('value').$type<ConfigValue>().notNull(),

    ...defaultTimestamps()
})

export const configKeyValues = configKey.enumValues;
export type ConfigKey = typeof configKeyValues[number];

export type ConfigSelect = typeof configs.$inferSelect
export type ConfigInsert = typeof configs.$inferInsert
