import fastifyPostgres from "@fastify/postgres";
import migrateRoutes from './routes/migrate.js';
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

import loginRoute from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import profileRoutes from "./routes/profile.js";

import { initDB } from "./init-db.js";
import { initPosts } from "./init-posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();
await app.register(fastifyPostgres, { connectionString: process.env.DATABASE_URL });
/* INIT TABLES */
if (process.env.DATABASE_URL) await initDB();
if (process.env.DATABASE_URL) await initPosts();

/* REGISTER ROUTES */
await app.register(migrateRoutes, { prefix: "" });
await app.register(loginRoute, { prefix: "/api" });
await app.register(postRoutes, { prefix: "/api" });
await app.register(profileRoutes, { prefix: "/api" });

/* STATIC FILES */
await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

/* ROOT */
app.get("/", async (req, reply) => {
  return reply.sendFile("index.html");
});

/* HEALTH */
app.get("/ping", async () => {
  return { status: "ok" };
});

/* VERSION */
app.get("/__version", async () => {
app.get("/__check_env", async () => {
  return { db: !!process.env.DATABASE_URL };
});
  return {
    version: "DEPLOY_" + (process.env.RENDER_GIT_COMMIT || "LOCAL")
  };
});

app.get("/__system_check", async () => {
  return {
    fastifyVersion: app.version,
    hasDatabaseURL: !!process.env.DATABASE_URL,
    hasPostgresPlugin: !!app.pg
  };
});

/* START SERVER */
app.get("/__system_check", async () => {
  return {
    fastifyVersion: app.version,
    hasDatabaseURL: !!process.env.DATABASE_URL,
    hasPostgresPlugin: !!app.pg
  };
});

await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("SERVER LIVE");
