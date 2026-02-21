import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

import migrateRoutes from "./routes/migrate.js";
import loginRoute from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import profileRoutes from "./routes/profile.js";

import { initDB } from "./init-db.js";
import { initPosts } from "./init-posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();
await app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log("🔥 AXIOM SERVER CLEAN BUILD");

/* REGISTER POSTGRES */

/* INIT TABLES */
if (process.env.DATABASE_URL) await initDB();
if (process.env.DATABASE_URL) await initPosts();

/* REGISTER ROUTES */
await app.register(migrateRoutes);
await app.register(loginRoute, { prefix: "/api" });
await app.register(postRoutes, { prefix: "/api" });
await app.register(profileRoutes, { prefix: "/api" });

/* STATIC FILES */
await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public")
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
  return {
    version: "DEPLOY_" + (process.env.RENDER_GIT_COMMIT || "LOCAL")
  };
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

console.log("SERVER LIVE");
