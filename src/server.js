import postRoutes from './routes/posts.js';
import { initPosts } from './init-posts.js';
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import loginRoute from "./routes/auth.js";
await app.register(postRoutes, { prefix: '/api' });
import { initDB } from "./init-db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();

// Initialize Database
await initDB();
await initPosts();

// API Routes
await app.register(loginRoute, { prefix: "/api" });
await app.register(postRoutes, { prefix: '/api' });

// Static Files
await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

// Root
app.get("/", async (req, reply) => {
  return reply.sendFile("index.html");
});

// Health
app.get("/ping", async () => {
  return { status: "ok" };
});

// Start
await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("SERVER LIVE");
