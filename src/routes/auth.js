import { registerUser, loginUser } from "../services/auth.js";

export default async function (fastify) {

  fastify.post("/auth/register", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.code(400).send({ error: "Email and password required" });
      }

      const user = await registerUser(fastify, email, password);

      return { success: true, user };

    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });

  fastify.post("/auth/login", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.code(400).send({ error: "Email and password required" });
      }

      const result = await loginUser(fastify, email, password);

      return { success: true, ...result };

    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });

}
