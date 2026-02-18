import crypto from "crypto";

const users = [];

export function createUser({ email }) {
  const user = {
    id: crypto.randomUUID(),
    email,
    createdAt: Date.now()
  };
  users.push(user);
  return user;
}

export function listUsers() {
  return users;
}
