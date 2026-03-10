export async function recommendTools(fastify,userId){

const result = await fastify.pg.query(`
SELECT entity_id AS tool_id, COUNT(*) AS runs
FROM activity
WHERE action='tool_run'
GROUP BY entity_id
ORDER BY runs DESC
LIMIT 5
`);

return result.rows;

}
