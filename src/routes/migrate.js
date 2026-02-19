import pool from "../db.js";

export default async function migrateRoutes(app) {

  app.get("/__migrate_v3", async () => {
    await pool.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS prompt TEXT;`);
    return { migrated: true };
  });

}
