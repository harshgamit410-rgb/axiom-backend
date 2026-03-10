export async function getToolRemixes(fastify,toolId){

const result = await fastify.pg.query(
"SELECT id,title FROM ai_tools WHERE parent_tool=$1",
[toolId]
);

return result.rows;

}
