import pool from "./db.js";

export async function initPosts() {

  // Ensure table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      image_url TEXT,
      caption TEXT,
      visibility TEXT DEFAULT 'public',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe column migrations
  await pool.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'post';`);
  await pool.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS parent_id UUID;`);

  console.log("POSTS TABLE READY (V2 MIGRATED)");
}
