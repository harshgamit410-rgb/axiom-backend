import { authGuard } from "../middleware/auth.js";
import pool from "../db.js";

export default async function profileRoutes(app) {

  app.get("/me", { preHandler: authGuard }, async (req) => {
    const result = await pool.query(
      "SELECT id, email, bio, avatar_url FROM users WHERE id = $1",
      [req.user.id]
    );
    return result.rows[0];
  });

  app.put("/me", { preHandler: authGuard }, async (req) => {
    const { bio, avatar_url } = req.body;

    await pool.query(
      "UPDATE users SET bio = $1, avatar_url = $2 WHERE id = $3",
      [bio || "", avatar_url || "", req.user.id]
    );

    return { updated: true };
  });
}
