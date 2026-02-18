import crypto from "crypto";
import pool from "../db.js";
import { authGuard } from "../middleware/auth.js";

export default async function postRoutes(app) {

  app.post("/posts", { preHandler: authGuard }, async (req, reply) => {
    const { image_url, caption, visibility, type, parent_id } = req.body;

    const id = crypto.randomUUID();

    await pool.query(
      `INSERT INTO posts (id, user_id, image_url, caption, visibility, type, parent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        id,
        req.user.id,
        image_url || null,
        caption || "",
        visibility || "public",
        type || "post",
        parent_id || null
      ]
    );

    return { created: true };
  });

  app.get("/posts", async () => {

    const result = await pool.query(`
      SELECT 
        p.*,
        u.email,
        parent.caption AS parent_caption,
        parent.image_url AS parent_image
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN posts parent ON p.parent_id = parent.id
      ORDER BY p.created_at DESC
    `);

    return result.rows;
  });
}
