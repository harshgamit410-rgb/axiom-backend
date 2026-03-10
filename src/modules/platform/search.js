export async function searchPlatform(fastify,q){

const tools = await fastify.pg.query(
"SELECT id,title FROM ai_tools WHERE title ILIKE $1 LIMIT 10",
[`%${q}%`]
);

const posts = await fastify.pg.query(
"SELECT id,content FROM workspace_files WHERE content ILIKE $1 LIMIT 10",
[`%${q}%`]
);

return {
tools:tools.rows,
posts:posts.rows
};

}
