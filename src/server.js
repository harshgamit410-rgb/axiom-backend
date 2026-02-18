import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import loginRoute from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

async function start() {
  try {
    await app.register(loginRoute, { prefix: "/api" });

    // DEBUG ROUTE
    app.get("/debug", async () => {
      return {
        dirname: __dirname,
        files: fs.readdirSync(__dirname)
      };
    });

    await app.register(fastifyStatic, {
      root: path.join(__dirname, "../public"),
      prefix: "/",
    });

    await app.listen({
      port: process.env.PORT || 4000,
      host: "0.0.0.0"
    });

    console.log("SERVER LIVE");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
