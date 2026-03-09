import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import dotenv from "dotenv";
import { runWorkflow } from "./modules/workflows/runner.js";

dotenv.config();

const app = Fastify();

await app.register(fastifyPostgres,{
connectionString:process.env.DATABASE_URL,
ssl:{rejectUnauthorized:false}
});

async function processJobs(){

const jobs = await app.pg.query(
"SELECT * FROM ai_runs WHERE status='queued' LIMIT 5"
);

for(const job of jobs.rows){

console.log("Running job:",job.id);

await app.pg.query(
"UPDATE ai_runs SET status='running' WHERE id=$1",
[job.id]
);

try{

const output = await runWorkflow(app,job.workflow_id,job.input);

await app.pg.query(
"UPDATE ai_runs SET status='completed',output=$1 WHERE id=$2",
[output,job.id]
);

console.log("Completed job:",job.id);

}catch(e){

await app.pg.query(
"UPDATE ai_runs SET status='failed' WHERE id=$1",
[job.id]
);

console.log("Job failed:",job.id);

}

}

}

setInterval(processJobs,3000);

console.log("AI Worker running...");
