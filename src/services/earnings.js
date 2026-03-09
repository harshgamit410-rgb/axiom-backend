export async function recordToolRun(fastify, toolId){

// find tool creator
const tool = await fastify.pg.query(
"SELECT user_id FROM ai_tools WHERE id=$1",
[toolId]
);

const creatorId = tool.rows[0]?.user_id;

if(!creatorId) return;

// update earnings
await fastify.pg.query(
`INSERT INTO creator_earnings (tool_id,creator_id,runs,revenue)
VALUES ($1,$2,1,0.002)
ON CONFLICT (tool_id)
DO UPDATE SET
runs = creator_earnings.runs + 1,
revenue = creator_earnings.revenue + 0.002`,
[toolId,creatorId]
);

}
