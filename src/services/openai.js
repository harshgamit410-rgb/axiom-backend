import OpenAI from "openai";

export async function generateText(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  return response.output_text;
}
