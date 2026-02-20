import pg from "pg";

const { Pool } = pg;

export const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null;

export async function initDB() {
  if (!pool) {
    console.log("NO DATABASE_URL — SKIPPING DB INIT");
    return;
  }
}
