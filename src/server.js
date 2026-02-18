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

await initDB();
await initPosts();

await app.register(loginRoute, { prefix: "/api" });
await app.register(postRoutes, { prefix: "/api" });
await app.register(profileRoutes, { prefix: "/api" });

await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

app.get("/", async (req, reply) => {
  return reply.sendFile("index.html");
});

app.get("/ping", async () => {
  return { status: "ok" };
});

await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("SERVER LIVE");
