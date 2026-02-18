import crypto from "crypto";
import bcrypt from "bcryptjs";

const authUsers = [];

export async function registerUser(email, password) {
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: crypto.randomUUID(),
    email,
    password: hash,
    createdAt: Date.now()
  };
  authUsers.push(user);
  return { id: user.id, email: user.email };
}

export async function loginUser(email, password) {
  const user = authUsers.find(u => u.email === email);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return user;
}
