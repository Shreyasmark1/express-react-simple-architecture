import Decimal from "decimal.js";
import { Tnx } from "../../lib/db/pg/transaction";
import { ApiError } from "../../lib/types/api-error";
import { WalletLogContext, walletLogs, wallets } from "../../schemas/wallet.repository";
import { eq } from "drizzle-orm"

type WalletOperation = {
    amount: string,
    userId: string,
    contextId: string,
    context: WalletLogContext
}

const getWallet = async (tnx: Tnx, userId: string) => {
    const result = await tnx.select()
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .for('update');

    if (!result || result.length === 0 || !result[0]) throw ApiError.notFound("Wallet not found or invalid user id");

    return result[0];
}

const credit = async (tnx: Tnx, body: WalletOperation) => {

    const wallet = await getWallet(tnx, body.userId);

    const currentBalance = new Decimal(wallet.currentBalance);
    const creditAmount = new Decimal(body.amount);

    const newBalance = currentBalance.add(creditAmount);

    const [updatedWallet] = await tnx.update(wallets)
        .set({ currentBalance: newBalance.toFixed(2) })
        .where(eq(wallets.walletId, wallet.walletId))
        .returning();

    if (!updatedWallet) throw ApiError.internalServerError("Failed to credit amount");

    const [walletLog] = await tnx.insert(walletLogs)
        .values({
            walletId: updatedWallet.walletId,
            operation: "credit",
            walletLogContextId: body.contextId,
            walletLogContext: body.context,
            amount: creditAmount.toFixed(2),
            userId: wallet.userId
        })
        .returning()

    if (!walletLog) throw ApiError.internalServerError("Failed to save wallet log");

    return { updatedWallet, walletLog };

}

const debit = async (tnx: Tnx, body: WalletOperation) => {

    const wallet = await getWallet(tnx, body.userId);

    const currentBalance = new Decimal(wallet.currentBalance);

    const amountAvailableForUse = currentBalance ;

    const debitAmount = new Decimal(body.amount);

    if (amountAvailableForUse.lessThan(debitAmount)) throw ApiError.badRequest('Insufficient balance in your wallet');

    const newBalance = currentBalance.minus(debitAmount);

    const [updatedWallet] = await tnx.update(wallets)
        .set({ currentBalance: newBalance.toFixed(2) })
        .where(eq(wallets.walletId, wallet.walletId))
        .returning();

    if (!updatedWallet) throw ApiError.internalServerError("Failed to debit amount");

    const [walletLog] = await tnx.insert(walletLogs)
        .values({
            walletId: updatedWallet.walletId,
            operation: "debit",
            walletLogContextId: body.contextId,
            walletLogContext: body.context,
            amount: debitAmount.toFixed(2),
            userId: wallet.userId
        })
        .returning()

    if (!walletLog) throw ApiError.internalServerError("Failed to save wallet log");

    return { updatedWallet, walletLog };
}


export const WalletService = {
    credit,
    debit,
    getWallet
}