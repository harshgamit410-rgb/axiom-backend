import { aiQueue } from "../../services/ai-queue.js";
import { runWorkflow } from "./runner.js";

export default async function (fastify){

fastify.post("/workflows/create", async (req)=>{

const {title}=req.body

const result=await fastify.pg.query(
`INSERT INTO workflows (title)
VALUES ($1)
RETURNING *`,
[title]
)

return {workflow:result.rows[0]}

})

fastify.post("/workflows/add-step", async (req)=>{

const {workflow_id,tool_id,step_order}=req.body

await fastify.pg.query(
`INSERT INTO workflow_steps (workflow_id,tool_id,step_order)
VALUES ($1,$2,$3)`,
[workflow_id,tool_id,step_order]
)

return {success:true}

})

fastify.get("/workflows", async ()=>{

const result=await fastify.pg.query(
"SELECT * FROM workflows ORDER BY created_at DESC"
)

return {workflows:result.rows}

})

fastify.post("/workflows/run", async (req)=>{

const {workflowId,input}=req.body

const job=await fastify.pg.query(`
INSERT INTO ai_runs (workflow_id,status,input)
VALUES ($1,'queued',$2)
RETURNING id`,
[workflowId,input]
)

console.log("QUEUE PUSH",job.rows[0].id);
await aiQueue.add("workflow",{
jobId:job.rows[0].id,
workflowId,
input
});
return {queued:true,jobId:job.rows[0].id}

})

}
