import { AnyPgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { count, SQL } from 'drizzle-orm';
import { numeric } from "drizzle-orm/pg-core";
import { DB } from "./connection";
import { Tnx } from "./transaction";

const primaryKey = (columnName: string) => uuid(columnName).primaryKey().defaultRandom();
const mobileNo = () => varchar('mobile_no', { length: 10 });
const email = () => varchar('email');
const decimal = numeric;
const datetime = timestamp;

const createdAt = () => {
    return timestamp('created_at', { withTimezone: true, mode: 'date' })
        .defaultNow()
        .notNull();
}

const updatedAt = () => {
    return timestamp('updated_at', { withTimezone: true, mode: 'date' })
        .defaultNow()
        .$onUpdate(() => new Date()) // for pg creates a drizzle middleware not a db trigger 
        .notNull()
}

const defaultTimestamps = () => {
    return {
        createdAt: createdAt(),
        updatedAt: updatedAt()
    }
}

const getTableCount = async (db: DB | Tnx, tableSchema: AnyPgTable, conditions?: SQL<unknown>): Promise<number> => {

    const result = await db
        .select({ count: count() })
        .from(tableSchema)
        .where(conditions)
        .limit(1);

    return result[0]?.count ? result[0].count : 0;
}

const offSet = (pageNumber: number, recLimit: number) => (pageNumber - 1) * recLimit;

export {
    primaryKey,
    defaultTimestamps,
    decimal,
    mobileNo,
    getTableCount,
    offSet,
    datetime,
    email
}

export type Image = { url: string }
