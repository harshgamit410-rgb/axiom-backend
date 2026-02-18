import jwt from "jsonwebtoken";

export default async function (app) {
  app.post("/auth/login", async (req, reply) => {
    const { email, password } = req.body || {};

    if (email !== "auth@axiom.ai" || password !== "123456") {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: "user-1", email },
      "ACCESS_SECRET",
      { expiresIn: "7d" }
    );

    return { login: true, token };
  });
}
