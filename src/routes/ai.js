import { generateAI } from "../services/groq.js";

export default async function (fastify){

fastify.post("/ai/generate", async (req)=>{

const {prompt}=req.body

const content = await generateAI(prompt)

return {content}

})

}
