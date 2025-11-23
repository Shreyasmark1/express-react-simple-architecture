import { dbConnectWithPool } from "../lib/db/pg/connection";
import { EnvVariables } from "./env-helper";

export const db = dbConnectWithPool(EnvVariables.dbUrl)