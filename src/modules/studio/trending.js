export async function trendingToolsRoute(fastify){

fastify.get("/tools/trending", async ()=>{

const result = await fastify.pg.query(`
SELECT 
ai_tools.id,
ai_tools.title,
COUNT(events.id) AS runs
FROM events
JOIN ai_tools ON ai_tools.id = events.entity_id
WHERE events.type='tool_run'
GROUP BY ai_tools.id
ORDER BY runs DESC
LIMIT 10
`);

return {tools:result.rows};

});

}
