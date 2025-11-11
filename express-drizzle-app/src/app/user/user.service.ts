import { and, asc, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { db, DB } from "../../lib/db/pg/connection";
import { Tnx, withTransaction } from "../../lib/db/pg/transaction";
import { offSet, getTableCount } from "../../lib/db/pg/util";
import { ApiError } from "../../lib/types/api-error";
import { StringUtils } from "../../lib/utils/string-util";
import { users } from "../../schemas/user.repository";
import { wallets } from "../../schemas/wallet.repository";
import { UserUpdate } from "./user.validator";

const getAllUsers = async (pageNumber: number, recLimit: number, search?: string) => {

    const conditions: SQL<unknown>[] = [];

    conditions.push(eq(users.role, "user"));

    const orderBy = [desc(users.createdAt), asc(users.userId)]

    if (StringUtils.isNotEmpty(search)) {

        const searchPattern = `%${search}%`;

        const searchCondition = or(
            ilike(users.username, searchPattern),
            ilike(users.publicId, searchPattern)
        )

        if (searchCondition) conditions.push(searchCondition)
        orderBy.unshift(asc(users.username))
    }

    const where = and(...conditions);

    const members = await db.query.users.findMany({
        with: {
            wallet: true
        },
        columns: {
            userId: true,
            username: true,
            mobileNo: true,
            publicId: true,
            createdAt: true
        },
        where,
        limit: recLimit ? recLimit : undefined,
        offset: offSet(pageNumber, recLimit),
        orderBy
    })

    const records = pageNumber === 1 ? await getTableCount(db, users, where) : 0;

    return { members, records };
}

const getUserById = async (db: DB | Tnx, userId: string) => {

    const user = await db.query.users.findFirst({
        with: {
            wallet: { columns: { walletId: true } },
            otpAuths: { columns: { createdAt: true } }
        },
        where: and(eq(users.userId, userId), eq(users.role, "user"))
    });

    if (!user) throw ApiError.notFound("User not found!");

    const wallet = await getWalletByUserId(db, userId)

    const { passwordHash, ...userDetail } = user;

    return { profile: { ...userDetail }, wallet }
}

const getWalletByUserId = async (tnx: Tnx | DB, userId: string) => {

    const wallet = await tnx.query.wallets.findFirst({
        where: eq(wallets.userId, userId)
    });

    if (!wallet) throw ApiError.internalServerError("User wallet not found!");

    return { wallet }
}

const updateUser = async (tnx: Tnx, { ...userDetails }: UserUpdate, userId: string) => {

    const currentUser = await tnx.query.users.findFirst({ where: () => eq(users.userId, userId) });

    if (!currentUser) throw ApiError.notFound("User not found!");

    await tnx.update(users).set(userDetails).where(eq(users.userId, userId));

    return await getUserById(tnx, userId);
}

export const UserService = {
    getAllUsers,
    updateUser: withTransaction(updateUser),
    getUser: (userId: string) => getUserById(db, userId),
    getWalletByUserId: (userId: string) => getWalletByUserId(db, userId)
}