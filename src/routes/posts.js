import crypto from "crypto";
import pool from "../db.js";
import { authGuard } from "../middleware/auth.js";

export default async function postRoutes(app) {

  app.post("/posts", { preHandler: authGuard }, async (req, reply) => {
    const { image_url, caption, visibility } = req.body;
    const id = crypto.randomUUID();

    await pool.query(
      "INSERT INTO posts (id, user_id, image_url, caption, visibility) VALUES ($1, $2, $3, $4, $5)",
      [id, req.user.id, image_url, caption || "", visibility || "public"]
    );

    return { created: true };
  });

  app.get("/posts", async () => {
    const result = await pool.query(
      "SELECT posts.*, users.email FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC"
    );

    return result.rows;
  });

}
