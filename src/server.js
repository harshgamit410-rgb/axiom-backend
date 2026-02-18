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

// Init tables
await initDB();
await initPosts();

// API Routes
await app.register(loginRoute, { prefix: "/api" });
await app.register(postRoutes, { prefix: "/api" });
await app.register(profileRoutes, { prefix: "/api" });

// Static files
await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/",   // important
});

// Health
app.get("/ping", async () => {
  return { status: "ok" };
});

// Version
app.get("/__version", async () => {
  return { version: "STATIC_FIX_V2" };
});

// Start
await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("SERVER LIVE");
// FORCE DEPLOY Wed Feb 18 16:38:28 IST 2026
