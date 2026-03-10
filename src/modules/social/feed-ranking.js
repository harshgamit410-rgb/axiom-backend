export async function getRankedFeed(fastify){

const result = await fastify.pg.query(`
SELECT workspace_files.*, COUNT(likes.id) AS likes
FROM workspace_files
LEFT JOIN shares ON shares.file_id = workspace_files.id
LEFT JOIN likes ON likes.share_id = shares.id
GROUP BY workspace_files.id
ORDER BY likes DESC, workspace_files.created_at DESC
LIMIT 20
`);

return result.rows;

}
