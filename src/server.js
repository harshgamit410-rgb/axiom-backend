import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import dotenv from "dotenv";

dotenv.config();

const app = Fastify({ logger: true });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL missing");
  process.exit(1);
}

await app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/ping", async () => {
  return { status: "ok" };
});

app.get("/__system_check", async () => {
  return {
    hasDatabaseURL: !!process.env.DATABASE_URL,
    hasPostgresPlugin: !!app.pg
  };
});

await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("🔥 POSTGRES TEST SERVER LIVE");
