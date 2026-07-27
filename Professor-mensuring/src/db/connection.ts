import { env } from "#lib/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionURL = env.DATABASE_URL;
const client = postgres(connectionURL)
export const db = drizzle(client);