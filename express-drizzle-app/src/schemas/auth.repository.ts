import { mobileNo, defaultTimestamps, primaryKey, datetime } from "../lib/db/pg/util";
import { pgTable, varchar, boolean, uuid  } from "drizzle-orm/pg-core";
import { users } from "./user.repository";
import { AppConstants } from "../config/app-constants";

export const otpAuths = pgTable('otp_auths', {
    authId: primaryKey('auth_id').notNull(),
    userId: uuid('user_id').references(() => users.userId),
    mobileNo: mobileNo().notNull(),
    token: uuid('token').notNull(),
    otp: varchar('otp', { length: AppConstants.otpLength }).notNull(),
    isExpired: boolean('is_expired').default(false),
    expiresAt: datetime('expires_at').notNull(),

    ...defaultTimestamps()
});


export type OtpAuthSelect = typeof otpAuths.$inferSelect
export type OtpAuthInsert = typeof otpAuths.$inferInsert