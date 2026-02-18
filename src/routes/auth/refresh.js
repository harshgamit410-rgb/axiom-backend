import jwt from "jsonwebtoken";

export default async function (app) {
  app.post("/refresh", async (req, reply) => {
    const token = req.cookies.refreshToken;
    if (!token) return reply.code(401).send({ error: "No refresh token" });

    try {
      const decoded = jwt.verify(token, "REFRESH_SECRET");

      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        "ACCESS_SECRET",
        { expiresIn: "15m" }
      );

      return { token: newAccessToken };
    } catch {
      return reply.code(401).send({ error: "Invalid refresh token" });
    }
  });
}
