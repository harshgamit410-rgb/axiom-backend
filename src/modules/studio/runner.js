import fetch from "node-fetch";
import { saveOutput } from "../workspace/save.js";

const API_BASE = process.env.API_BASE || "https://axiom-backend-1.onrender.com";

export async function runTool(fastify, toolId, input, projectId){

const tool = await fastify.pg.query(
"SELECT * FROM ai_tools WHERE id=$1",
[toolId]
);

const template = tool.rows[0].prompt_template;

const prompt = template.replace("{input}",input);

const response = await fetch(API_BASE + "/api/ai/generate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({prompt})
});

const data = await response.json();

if(projectId){
await saveOutput(fastify,projectId,data.content);
}

return data.content;

}
