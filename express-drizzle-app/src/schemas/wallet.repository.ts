import { pgTable, uuid, pgEnum } from "drizzle-orm/pg-core"
import { decimal, defaultTimestamps, primaryKey } from "../lib/db/pg/util"
import { users } from "./user.repository"

export const walletLogOperation = pgEnum('wallet_log_operation', ['credit', 'debit']);
export const walletLogContext = pgEnum('wallet_log_context', ['installment_commission', 'mpin_purchase', 'bank_withdrawal']);

export const wallets = pgTable('wallet', {
    walletId: primaryKey('wallet_id'),
    userId: uuid('user_id').references(() => users.userId).unique().notNull(),
    currentBalance: decimal('current_balance', { precision: 10, scale: 2 }).notNull(),

    ...defaultTimestamps()
});

export const walletLogs = pgTable('wallet_log', {
    walletLogId: primaryKey('wallet_log_id'),
    walletId: uuid('wallet_id').references(() => wallets.walletId).notNull(),
    operation: walletLogOperation('operation').notNull(),
    walletLogContextId: uuid('context_id').notNull(),
    walletLogContext: walletLogContext('wallet_log_context').notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    userId: uuid('user_id').references(() => users.userId).notNull(),

    ...defaultTimestamps()
});

const walletLogOperationValues = walletLogOperation.enumValues.map((i) => i);
export type WalletLogOperation = typeof walletLogOperationValues[number]

const walletLogContextValues = walletLogContext.enumValues.map((i) => i);
export type WalletLogContext = typeof walletLogContextValues[number]

export type WalletSelect = typeof wallets.$inferSelect
export type WalletInsert = typeof wallets.$inferInsert