import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import dotenv from "dotenv";

import aiRoutes from "./routes/ai.js";
import hfRoutes from "./routes/hf.js";
import migrateRoutes from "./routes/migrate.js";

dotenv.config();

const app = Fastify({ logger: true });

/* REGISTER POSTGRES */
await app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* REGISTER ROUTES */
await app.register(aiRoutes, { prefix: "/api" });
await app.register(hfRoutes, { prefix: "/api" });
await app.register(migrateRoutes);

/* HEALTH */
app.get("/ping", async () => {
  return { status: "ok" };
});

/* SYSTEM CHECK */
app.get("/__system_check", async () => {
  return {
    fastifyVersion: app.version,
    hasDatabaseURL: !!process.env.DATABASE_URL,
    hasPostgresPlugin: !!app.pg
  };
});

/* START SERVER */
await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("🔥 AXIOM PRODUCTION SERVER LIVE");
