import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
const connection = new IORedis(process.env.REDIS_URL);
port:6379,
maxRetriesPerRequest:null
});

export const aiQueue = new Queue("ai-jobs",{connection});
