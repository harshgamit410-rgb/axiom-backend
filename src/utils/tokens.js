import jwt from "jsonwebtoken";

const ACCESS_SECRET = "ACCESS_SECRET_123";
const REFRESH_SECRET = "REFRESH_SECRET_456";

export const signAccess = payload =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });

export const signRefresh = payload =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccess = token =>
  jwt.verify(token, ACCESS_SECRET);

export const verifyRefresh = token =>
  jwt.verify(token, REFRESH_SECRET);
