import { verifyToken } from "../services/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";

export default async function (fastify) {

  fastify.post("/posts", { preHandler: verifyToken }, async (request, reply) => {
    const { content } = request.body;

    if (!content) {
      return reply.code(400).send({ error: "Content required" });
    }

    const id = uuidv4();

    await fastify.pg.query(
      "INSERT INTO posts (id, user_id, content) VALUES ($1, $2, $3)",
      [id, request.user.userId, content]
    );

    return { success: true, id };
  });

  fastify.get("/my-posts", { preHandler: verifyToken }, async (request) => {
    const result = await fastify.pg.query(
      "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [request.user.userId]
    );

    return result.rows;
  });

  fastify.get("/feed", async () => {
    const result = await fastify.pg.query(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT 20"
    );

    return result.rows;
  });

}
