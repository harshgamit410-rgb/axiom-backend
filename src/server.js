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

/* INIT TABLES */
await initDB();
await initPosts();

/* REGISTER ROUTES (BEFORE LISTEN) */
await app.register(loginRoute, { prefix: "/api" });
await app.register(postRoutes, { prefix: "/api" });
await app.register(profileRoutes, { prefix: "/api" });

/* VERSION CHECK */
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

/* START SERVER (ALWAYS LAST) */
fastify.get("/__version", async (request, reply) => {
  return { version: "DEPLOY_" + (process.env.RENDER_GIT_COMMIT || "LOCAL") };
});

import { execSync } from "child_process";

  host: "0.0.0.0"
});

console.log("SERVER LIVE");

