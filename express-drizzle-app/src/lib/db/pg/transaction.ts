// New fnType definition for a general function:
// It takes a ClientSession as its FIRST argument, followed by any other arguments.

import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { ExtractTablesWithRelations } from "drizzle-orm";
import * as schemas from "./schema";
import { db } from "./connection";

export type Tnx = PgTransaction<NodePgQueryResultHKT, typeof schemas, ExtractTablesWithRelations<typeof schemas>> 

// This is a common pattern for "injecting" a dependency like a session.
type FnWithSession<TArgs extends any[], TReturn> = (tnx: Tnx, ...args: TArgs) => Promise<TReturn>;

// The higher-order function that provides the transaction
export const withTransaction = <TArgs extends any[], TReturn>(
    fn: FnWithSession<TArgs, TReturn>
) => {
    // This inner function is what you'll call directly with your specific arguments
    // (excluding the session, which withTransaction will provide).
    return async (...args: TArgs): Promise<TReturn> => {

        try {
            // Call the original function, passing the session as the first argument,
            // followed by any arguments that were passed to the returned function.

            const result = await db.transaction(async (tnx: Tnx) => {
                return await fn(tnx, ...args);
            })

            return result;

        } catch (error) {
            console.error("Transaction failed, aborting:", error);
            // Re-throw the error so the caller knows the operation failed
            throw error;
        } finally {
        }
    };
};