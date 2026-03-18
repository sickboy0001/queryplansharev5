import { createClient } from "@libsql/client";

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_CONNECTION_URL is not defined");
}

export const client = createClient({
  url,
  authToken,
});

/**
 * Execute a query with parameters
 */
export async function query(sql: string, args: any[] = []) {
  try {
    const result = await client.execute({ sql, args });
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Execute a transaction (optional helper)
 */
export async function transaction(queries: { sql: string; args: any[] }[]) {
  return await client.batch(queries, "write");
}
