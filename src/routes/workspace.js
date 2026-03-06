export default async function (fastify) {

  fastify.post("/apps/install", async (req, reply) => {

    const auth = req.headers.authorization;
    if (!auth) return reply.code(401).send({ error: "Unauthorized" });

    const token = auth.split(" ")[1];
    const payload = fastify.jwt.verify(token);

    const { appId } = req.body;

    await fastify.pg.query(
      "INSERT INTO app_installs (user_id, app_id) VALUES ($1,$2)",
      [payload.userId, appId]
    );

    return { installed: true };

  });


  /* SAVE AI APP DRAFT */
  fastify.post("/workspace/save", async (req, reply) => {

    const auth = req.headers.authorization;
    if (!auth) return reply.code(401).send({ error: "Unauthorized" });

    const token = auth.split(" ")[1];
    const payload = fastify.jwt.verify(token);

    const { title, type, data } = req.body;

    const result = await fastify.pg.query(
      "INSERT INTO workspace_drafts (user_id,title,type,data) VALUES ($1,$2,$3,$4) RETURNING id",
      [payload.userId, title, type, data]
    );

    return { success: true, draftId: result.rows[0].id };

  });


  /* GET USER DRAFTS */
  fastify.get("/workspace/my-drafts", async (req, reply) => {

    const auth = req.headers.authorization;
    if (!auth) return reply.code(401).send({ error: "Unauthorized" });

    const token = auth.split(" ")[1];
    const payload = fastify.jwt.verify(token);

    const result = await fastify.pg.query(
      "SELECT * FROM workspace_drafts WHERE user_id=$1 ORDER BY created_at DESC",
      [payload.userId]
    );

    return { drafts: result.rows };

  });


  /* PUBLISH AI APP */
  fastify.post("/workspace/publish", async (req, reply) => {

    const auth = req.headers.authorization;
    if (!auth) return reply.code(401).send({ error: "Unauthorized" });

    const token = auth.split(" ")[1];
    const payload = fastify.jwt.verify(token);

    const { draftId } = req.body;

    const draft = await fastify.pg.query(
      "SELECT * FROM workspace_drafts WHERE id=$1 AND user_id=$2",
      [draftId, payload.userId]
    );

    if (draft.rows.length === 0) {
      return reply.code(404).send({ error: "Draft not found" });
    }

    const d = draft.rows[0];

    const result = await fastify.pg.query(
      "INSERT INTO apps (user_id,title,type,config) VALUES ($1,$2,$3,$4) RETURNING id",
      [d.user_id, d.title, d.type, d.data]
    );

    return { success: true, appId: result.rows[0].id };

  });


  /* PUBLIC APPS FEED */
  fastify.get("/apps", async () => {

    const result = await fastify.pg.query(
      "SELECT id,title,type,created_at FROM apps ORDER BY created_at DESC"
    );

    return { apps: result.rows };

  });


  /* RUN AI APP */
  fastify.post("/apps/run", async (req, reply) => {

    const { appId, input } = req.body;

    if (!appId || !input) {
      return reply.code(400).send({ error: "appId and input required" });
    }

    const app = await fastify.pg.query(
      "SELECT * FROM apps WHERE id=$1",
      [appId]
    );

    if (app.rows.length === 0) {
      return reply.code(404).send({ error: "App not found" });
    }

    const config = app.rows[0].config;

    const prompt = config.prompt + ": " + input;


    const { aiQueue } = await import("../services/queue.js");

    const job = await aiQueue.add("ai-job", {
      prompt
    });

    return {
      queued: true,
      jobId: job.id
    };

  });

}

/* INSTALLED APPS */

export async function installedAppsRoute(fastify) {

  fastify.get("/apps/installed", async (req, reply) => {

    const auth = req.headers.authorization;
    if (!auth) return reply.code(401).send({ error: "Unauthorized" });

    const token = auth.split(" ")[1];
    const payload = fastify.jwt.verify(token);

    const result = await fastify.pg.query(
      `SELECT apps.* 
       FROM app_installs 
       JOIN apps ON apps.id = app_installs.app_id 
       WHERE app_installs.user_id = $1`,
      [payload.userId]
    );

    return { apps: result.rows };

  });

}

