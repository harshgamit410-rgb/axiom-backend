export default async function (fastify, opts) {

  const { generateText } = await import("../services/openai.js");

  fastify.post("/ai/generate", async (request, reply) => {
    try {
      const { prompt } = request.body;

      if (!prompt) {
        return reply.status(400).send({ error: "Prompt required" });
      }

      const output = await generateText(prompt);

      return { result: output };

    } catch (err) {
      console.error("AI ERROR:", err);
      return reply.status(500).send({ error: err.message });
    }
  });

}
