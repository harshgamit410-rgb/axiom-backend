import { verifyToken } from "../services/authMiddleware.js";
import { generateHF } from "../services/hf.js";
import { v4 as uuidv4 } from "uuid";

export default async function (fastify) {

  fastify.post("/ai/generate", { preHandler: verifyToken }, async (request, reply) => {
    try {
      const { prompt } = request.body;

      if (!prompt) {
        return reply.code(400).send({ error: "Prompt required" });
      }

      const output = await generateHF(prompt);

      const id = uuidv4();

      await fastify.pg.query(
        `INSERT INTO posts 
        (id, user_id, content, prompt, ai_generated, type, visibility) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          id,
          request.user.userId,
          output,
          prompt,
          true,
          'ai',
          'private'
        ]
      );

      return {
        success: true,
        id,
        content: output
      };

    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: err.message || "AI generation failed" });
    }
  });

}
