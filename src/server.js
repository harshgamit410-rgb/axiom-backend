import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import loginRoute from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();

// API
await app.register(loginRoute, { prefix: "/api" });

// DEBUG
app.get("/debug", async () => {
  return { status: "DEBUG WORKING" };
});

// STATIC
await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/",
  index: ["index.html"],
});

// START
await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("SERVER LIVE");
