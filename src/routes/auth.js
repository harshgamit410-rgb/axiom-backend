import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../store/auth.js";

const SECRET = "axiom-secret";

export default async function authRoutes(app) {

  app.post("/auth/register", async (req, reply) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return reply.code(400).send({ error: "email & password required" });
    }

    const user = await registerUser(email, password);
    return { registered: true, user };
  });

  app.post("/auth/login", async (req, reply) => {
    const { email, password } = req.body || {};
    const user = await loginUser(email, password);

    if (!user) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "15m" }
    );

    return { login: true, token };
  });

}
