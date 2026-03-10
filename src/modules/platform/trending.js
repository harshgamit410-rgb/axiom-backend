export async function getTrendingTools(fastify){

const result = await fastify.pg.query(`
SELECT entity_id AS tool_id, COUNT(*) AS runs
FROM activity
WHERE action='tool_run'
GROUP BY entity_id
ORDER BY runs DESC
LIMIT 10
`);

return result.rows;

}
