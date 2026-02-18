import { verifyRefresh, signAccess } from "../utils/tokens.js";

export default async function refresh(app) {
  app.post("/auth/refresh", async (req, reply) => {
    const token = req.cookies.refreshToken;
    if (!token) return reply.code(401).send({ error: "No token" });

    try {
      const payload = verifyRefresh(token);
      const newAccess = signAccess({ id: payload.id, email: payload.email });
      return { token: newAccess };
    } catch {
      return reply.code(401).send({ error: "Invalid refresh" });
    }
  });
}
