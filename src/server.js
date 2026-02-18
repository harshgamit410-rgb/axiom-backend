import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import loginRoute from "./routes/auth.js";
import { initDB } from "./init-db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

// Initialize Database
await initDB();

// API Routes
await app.register(loginRoute, { prefix: "/api" });

// Static Files
await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/",
  index: ["index.html"]
});

// Start Server
await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("SERVER LIVE");
