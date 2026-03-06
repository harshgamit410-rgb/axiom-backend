import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379",{ maxRetriesPerRequest: null });

const worker = new Worker(
  "ai-jobs",
  async job => {

    console.log("Processing job:", job.data);

    const { prompt } = job.data;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.2-3B-Instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200
        })
      }
    );

    const data = await response.json();

    const output = data.choices?.[0]?.message?.content || "No output";

    console.log("AI Output:", output);

    return output;

  },
  { connection }
);

console.log("🚀 AI Worker running...");
