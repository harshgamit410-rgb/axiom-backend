export default async function (fastify){

fastify.post("/workspace/project", async (req)=>{

const {userId,title} = req.body;

const result = await fastify.pg.query(
"INSERT INTO workspace_projects (user_id,title) VALUES ($1,$2) RETURNING *",
[userId,title]
);

return {project:result.rows[0]};

});

fastify.get("/workspace/projects/:userId", async (req)=>{

const {userId} = req.params;

const result = await fastify.pg.query(
"SELECT * FROM workspace_projects WHERE user_id=$1",
[userId]
);

return {projects:result.rows};

});

fastify.post("/workspace/file", async (req)=>{

const {projectId,type,content} = req.body;

const result = await fastify.pg.query(
"INSERT INTO workspace_files (project_id,type,content) VALUES ($1,$2,$3) RETURNING *",
[projectId,type,content]
);

return {file:result.rows[0]};

});

fastify.get("/workspace/files/:projectId", async (req)=>{

const {projectId} = req.params;

const result = await fastify.pg.query(
"SELECT * FROM workspace_files WHERE project_id=$1",
[projectId]
);

return {files:result.rows};

});

}
