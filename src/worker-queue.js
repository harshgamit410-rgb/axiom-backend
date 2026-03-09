import { Worker } from "bullmq";
import IORedis from "ioredis";
import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import dotenv from "dotenv";
import { runWorkflow } from "./modules/workflows/runner.js";

dotenv.config();

const connection = new IORedis({
host:"127.0.0.1",
port:6379,
maxRetriesPerRequest:null
});

const app = Fastify();

await app.register(fastifyPostgres,{
connectionString:process.env.DATABASE_URL,
ssl:{rejectUnauthorized:false}
});

const worker = new Worker("ai-jobs", async job => {

const { jobId, workflowId, input } = job.data || {};

console.log("Processing queue job:",jobId);

await app.pg.query(
"UPDATE ai_runs SET status='running' WHERE id=$1",
[jobId]
);

try{

const output = await runWorkflow(app,workflowId,input);

await app.pg.query(
"UPDATE ai_runs SET status='completed',output=$1 WHERE id=$2",
[output,jobId]
);

console.log("Completed queue job:",jobId);

}catch(e){

await app.pg.query(
"UPDATE ai_runs SET status='failed' WHERE id=$1",
[jobId]
);

console.log("Queue job failed:",jobId);

}

},{
connection
});

console.log("Queue worker running...");
