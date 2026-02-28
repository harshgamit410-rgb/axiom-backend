import axios from "axios";

const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2"; 
// you can replace gpt2 with any free model

export async function hfGenerate(prompt) {
  const resp = await axios.post(
    HF_API_URL,
    { inputs: prompt },
    { headers: { "Content-Type": "application/json" } }
  );
  return resp.data?.generated_text || "";
}
