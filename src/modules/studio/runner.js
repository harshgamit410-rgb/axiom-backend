import fetch from "node-fetch";

export async function runTool(fastify, toolId, input){

const tool = await fastify.pg.query(
"SELECT * FROM ai_tools WHERE id=$1",
[toolId]
);

const template = tool.rows[0].prompt_template;

const prompt = template.replace("{input}",input);

const response = await fetch("http://localhost:4000/api/ai/generate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({prompt})
});

const data = await response.json();

return data.content;

}
