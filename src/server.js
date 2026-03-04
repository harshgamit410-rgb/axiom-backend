import fastifyStatic from "@fastify/static";
import workspaceRoutes from "./routes/workspace.js";
import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import dotenv from "dotenv";

import migrateRoutes from "./routes/migrate.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postsRoutes from "./routes/posts.js";
import aiRoutes from "./routes/ai.js";
import hfRoutes from "./routes/hf.js";

dotenv.config();

const app = Fastify({ logger: true });
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
await app.register(fastifyStatic,{
root:path.join(__dirname,"../public")
});
await app.register(fastifyJwt, { secret: "process.env.JWT_SECRET" });

await app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* REGISTER ROUTES */
await app.register(migrateRoutes);
await app.register(authRoutes);
await app.register(userRoutes);
await app.register(postsRoutes);
await app.register(aiRoutes, { prefix: "/api" });
await app.register(workspaceRoutes, { prefix: "/api" });
await app.register(hfRoutes, { prefix: "/api" });

app.get("/ping", async () => ({ status: "ok" }));

app.get("/__system_check", async () => ({
  hasDatabaseURL: !!process.env.DATABASE_URL,
  hasPostgresPlugin: !!app.pg
}));

await app.listen({
  port: process.env.PORT || 4000,
  host: "0.0.0.0"
});

console.log("🔥 AXIOM HYBRID MONOLITH LIVE");
