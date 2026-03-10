import rankedFeedRoute from "./modules/social/feed-route.js";
import toolGraphRoute from "./modules/platform/tool-graph-route.js";
import { remixToolRoute } from "./modules/studio/routes.js";
import searchRoute from "./modules/platform/search-route.js";
import recommendRoute from "./modules/platform/recommend-route.js";
import trendingRoute from "./modules/platform/trending-route.js";
import platformRoutes from "./routes/platform.js";
import { usageRoute } from "./modules/ai/routes.js";
import { tagRoute } from "./modules/social/routes.js";
import { reportRoute } from "./modules/social/routes.js";
import { bookmarkRoute } from "./modules/social/routes.js";
import { messageRoute } from "./modules/social/routes.js";
import { notificationRoute } from "./modules/social/routes.js";
import { followRoute } from "./modules/social/routes.js";
import { likeRoute, commentRoute } from "./modules/social/routes.js";
import socialRoutes from "./modules/social/routes.js";
import { marketplaceToolsRoute } from "./modules/studio/routes.js";
import workspaceModule from "./modules/workspace/routes.js";
import creatorRoutes from "./modules/creator/routes.js";
import { trendingToolsRoute } from "./modules/studio/trending.js";
import jobsRoutes from "./routes/jobs.js";
import fastifyStatic from "@fastify/static";
import workspaceRoutes from "./routes/workspace.js";
import studioRoutes from "./modules/studio/routes.js";
import { toolRunRoute } from "./modules/studio/routes.js";
import { installToolRoute } from "./modules/studio/routes.js";
import { installedToolsRoute } from "./modules/studio/routes.js";
import workflowRoutes from "./modules/workflows/routes.js";
import { installedAppsRoute } from "./routes/workspace.js";
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
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
await app.register(fastifyStatic,{
root:path.join(__dirname,"../public"),
prefix:"/",
decorateReply:false
});
await app.register(fastifyJwt, { secret: "process.env.JWT_SECRET" });

await app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* REGISTER ROUTES */
await app.register(socialRoutes,{prefix:"/api"});
await app.register(likeRoute,{prefix:"/api"});
await app.register(commentRoute,{prefix:"/api"});
await app.register(followRoute,{prefix:"/api"});
await app.register(notificationRoute,{prefix:"/api"});
await app.register(messageRoute,{prefix:"/api"});
await app.register(bookmarkRoute,{prefix:"/api"});
await app.register(reportRoute,{prefix:"/api"});
await app.register(tagRoute,{prefix:"/api"});
await app.register(marketplaceToolsRoute,{prefix:"/api"});
await app.register(workspaceModule,{prefix:"/api"});
await app.register(jobsRoutes, { prefix: "/api" });
await app.register(migrateRoutes);
await app.register(authRoutes);
await app.register(userRoutes);
await app.register(postsRoutes);
await app.register(aiRoutes, { prefix: "/api" });
await app.register(workspaceRoutes, { prefix: "/api" });
await app.register(studioRoutes, { prefix: "/api" });
await app.register(toolRunRoute,{prefix:"/api"});
await app.register(remixToolRoute,{prefix:"/api"});
await app.register(installToolRoute,{prefix:"/api"});
await app.register(installedToolsRoute,{prefix:"/api"});
await app.register(creatorRoutes,{prefix:"/api"});
await app.register(trendingToolsRoute,{prefix:"/api"});
await app.register(workflowRoutes, { prefix: "/api" });
await app.register(installedAppsRoute, { prefix: "/api" });
await app.register(hfRoutes, { prefix: "/api" });
await app.register(platformRoutes,{prefix:"/api"});
await app.register(trendingRoute,{prefix:"/api"});
await app.register(recommendRoute,{prefix:"/api"});
await app.register(searchRoute,{prefix:"/api"});
await app.register(toolGraphRoute,{prefix:"/api"});
await app.register(rankedFeedRoute,{prefix:"/api"});
await app.register(usageRoute,{prefix:"/api"});

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
// render rebuild
