import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import dotenv from "dotenv";

import aiRoutes from "./routes/ai.js";
import hfRoutes from "./routes/hf.js";

dotenv.config();

const app = Fastify({ logger: true });

await app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

await app.register(aiRoutes, { prefix: "/api" });
await app.register(hfRoutes, { prefix: "/api" });

app.get("/ping", async () => ({ status: "ok" }));

app.get("/__system_check", async () => ({
  hasDatabaseURL: !!process.env.DATABASE_URL,
  hasPostgresPlugin: !!app.pg
}));

await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("🔥 AXIOM FULL SERVER LIVE");
