export default async function (fastify) {

  fastify.post("/ai/hf", async (req, reply) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return reply.code(400).send({ error: "Prompt required" });
      }

      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
              { role: "user", content: prompt }
            ],
            max_tokens: 200
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return reply.code(500).send({ error: data });
      }

      return {
        result: data.choices?.[0]?.message?.content || "No output"
      };

    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  });

}
