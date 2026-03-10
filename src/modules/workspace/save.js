export async function saveOutput(fastify, projectId, content){

const result = await fastify.pg.query(
"INSERT INTO workspace_files (project_id,type,content) VALUES ($1,$2,$3) RETURNING *",
[projectId,"text",content]
);

return result.rows[0];

}
