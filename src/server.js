import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import loginRoute from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();

await app.register(loginRoute, { prefix: "/api" });

await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

app.get("/", async (req, reply) => {
  return reply.sendFile("index.html");
});

app.get("/ping", async () => {
  return "pong";
});

await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("SERVER LIVE");
