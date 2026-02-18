import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import loginRoute from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();

/* API Routes */
await app.register(loginRoute, { prefix: "/api" });

/* Serve Static Files */
await app.register(fastifyStatic, {
  root: path.join(__dirname, "../public")
});

/* Explicit Root Route */
app.get("/", async (request, reply) => {
  return reply.sendFile("index.html");
});

/* Health Check */
app.get("/ping", async () => {
  return { status: "ok" };
});

/* Start Server */
try {
  await app.listen({
    port: process.env.PORT || 4000,
    host: "0.0.0.0"
  });
  console.log("SERVER LIVE");
} catch (err) {
  console.error(err);
  process.exit(1);
}
