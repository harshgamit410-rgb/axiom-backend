import { recordToolRun } from "../../services/earnings.js";
import { trackEvent } from "../../services/events.js";
export default async function (fastify){

fastify.post("/studio/create", async (req,reply)=>{

const {title,prompt}=req.body

const user=req.user?.userId || null

const result=await fastify.pg.query(
`INSERT INTO ai_tools (user_id,title,prompt_template)
VALUES ($1,$2,$3)
RETURNING *`,
[user,title,prompt]
)

return {tool:result.rows[0]}

})

fastify.get("/studio/tools", async ()=>{

const result=await fastify.pg.query(
"SELECT * FROM ai_tools ORDER BY created_at DESC"
)

return {tools:result.rows}

})

}

import { runTool } from "./runner.js";

export async function toolRunRoute(fastify){

fastify.post("/tools/run", async (req)=>{

const {toolId,input}=req.body;

const output = await runTool(fastify,toolId,input);

await trackEvent(fastify,"tool_run",null,toolId,{input});
await recordToolRun(fastify,toolId);
return {output};

});

}


export async function installToolRoute(fastify){

fastify.post("/tools/install", async (req)=>{

const {userId,toolId} = req.body;

await fastify.pg.query(
"INSERT INTO app_installs (user_id,app_id) VALUES ($1,$2)",
[userId,toolId]
);

await trackEvent(fastify,"tool_install",userId,toolId,{});
return {installed:true};

});

}

export async function installedToolsRoute(fastify){

fastify.get("/tools/installed/:userId", async (req)=>{

const { userId } = req.params;

const result = await fastify.pg.query(
`SELECT ai_tools.*
FROM app_installs
JOIN ai_tools ON ai_tools.id = app_installs.app_id
WHERE app_installs.user_id = $1`,
[userId]
);

return {tools:result.rows};

});

}
