import { authGuard } from "./middleware/auth.js";
import loginRoute from "./routes/auth.js";
import Fastify from "fastify";

console.log("BOOT_FRESH");

const app = Fastify();

app.get("/", async () => "SERVER_VERSION_777");

app.get("/__health", async () => ({ status: "ok" }));

app.get("/api/test", async () => "API_OK");
app.get("/api/protected", { preHandler: authGuard }, async (req) => {
  return { message: "Protected OK", user: req.user };
});

await app.register(loginRoute, { prefix: "/api" });
console.log(app.printRoutes());
console.log(app.printRoutes())
await app.listen({ port: process.env.PORT || 4000, host: "0.0.0.0" });
