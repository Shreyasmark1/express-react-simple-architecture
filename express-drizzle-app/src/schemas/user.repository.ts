import { json, pgTable, text, varchar, pgEnum } from "drizzle-orm/pg-core";
import { mobileNo, defaultTimestamps, primaryKey, Image, email } from "../lib/db/pg/util";
import { relations } from "drizzle-orm";
import { otpAuths } from "./auth.repository";
import { wallets } from "./wallet.repository";

export const userRole = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable('users', {

    userId: primaryKey('user_id'),
    username: varchar('user_name', { length: 255 }).notNull(),
    passwordHash: text('password_hash').notNull(),
    mobileNo: mobileNo().notNull(),
    email: email().notNull(),
    role: userRole('role').default("user").notNull(),

    // auto generated in scheduler
    publicId: varchar('public_id').unique(),

    // other details
    userImage: json('user_image').$type<Image>(),

    ...defaultTimestamps()
});

export const usersRelations = relations(users, ({ one, many }) => ({
    wallet: one(wallets, {
        fields: [users.userId],
        references: [wallets.userId]
    }),
    otpAuths: many(otpAuths)
}));

const userRoleValues = userRole.enumValues.map((i) => i);
export type UserRoles = typeof userRoleValues[number];

export type UserSelect = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert