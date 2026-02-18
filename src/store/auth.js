import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "../db.js";

export async function registerUser(email, password) {
  const hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  await pool.query(
    "INSERT INTO users (id, email, password) VALUES ($1, $2, $3)",
    [id, email, hash]
  );

  return { id, email };
}

export async function loginUser(email, password) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return { id: user.id, email: user.email };
}
