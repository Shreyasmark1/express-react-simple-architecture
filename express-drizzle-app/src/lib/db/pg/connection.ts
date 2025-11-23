import { Pool } from 'pg'; // PostgreSQL client library
import * as schema from './schema';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { ApiError } from '../../types/api-error';

export const dbConnectWithPool = (connectionString: string) => {

  const pool = new Pool({
    connectionString,
    max: 20
  });

  return drizzle(pool, { schema });
}

export type DbSchema = typeof schema;

export type DB = NodePgDatabase<DbSchema> & {
  $client: Pool;
}

export const testConnection = async (db: DB) => {
    try {
        await db.execute(sql`SELECT 1`);
        console.log("db connected sucessfully");
    } catch (error: any) {
        console.error(error)
        throw ApiError.internalServerError(error.message)
    }
}