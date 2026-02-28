import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateText(prompt) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a powerful AI assistant inside Axiom platform." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content;
}
