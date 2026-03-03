import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "axiom_dev_secret";

export async function registerUser(fastify, email, password) {
  const existing = await fastify.pg.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await fastify.pg.query(
    "INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)",
    [id, email, password_hash]
  );

  return { id, email };
}

export async function loginUser(fastify, email, password) {
  const result = await fastify.pg.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      plan: user.plan
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
}
