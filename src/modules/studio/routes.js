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
fastify.get("/tools/marketplace", async () => {
const result = await fastify.pg.query(
"SELECT id,title FROM ai_tools WHERE is_public=true ORDER BY created_at DESC"
);
return {tools:result.rows};
});


const result=await fastify.pg.query(
"SELECT * FROM ai_tools ORDER BY created_at DESC"
)

return {tools:result.rows}

})

}

import { runTool } from "./runner.js";

export async function toolRunRoute(fastify){

fastify.post("/tools/run", async (req)=>{

const {toolId,input,projectId}=req.body;

const output = await runTool(fastify,toolId,input,projectId);

await trackEvent(fastify,"tool_run",null,toolId,{input});
await recordToolRun(fastify,toolId);
await fastify.pg.query("INSERT INTO usage_logs (user_id,tool_id,tokens,cost) VALUES ($1,$2,$3,$4)",[req.body.userId || null,toolId,100,0.001]);
await recordCreatorRevenue(fastify,toolId);
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

export async function marketplaceToolsRoute(fastify){

fastify.get("/tools/marketplace", async () => {

const result = await fastify.pg.query(
"SELECT id,title FROM ai_tools WHERE is_public=true ORDER BY created_at DESC"
);

return {tools:result.rows};

});

}

export async function rateLimitCheck(fastify,userId){

const limit = await fastify.pg.query(
"SELECT daily_limit FROM user_limits WHERE user_id=$1",
[userId]
)

const usage = await fastify.pg.query(
"SELECT COUNT(*) as runs FROM usage_logs WHERE user_id=$1 AND created_at > NOW() - INTERVAL '1 day'",
[userId]
)

if(limit.rows.length && usage.rows[0].runs >= limit.rows[0].daily_limit){
throw new Error("Daily AI limit reached")
}

}

export async function recordCreatorRevenue(fastify,toolId){

const creator = await fastify.pg.query(
"SELECT user_id FROM ai_tools WHERE id=$1",
[toolId]
)

if(!creator.rows.length || !creator.rows[0].user_id) return

await fastify.pg.query(
"INSERT INTO creator_earnings (tool_id,creator_id,runs,revenue) VALUES ($1,$2,1,0.002) ON CONFLICT (tool_id) DO UPDATE SET runs=creator_earnings.runs+1,revenue=creator_earnings.revenue+0.002",
[toolId,creator.rows[0].user_id]
)

}
