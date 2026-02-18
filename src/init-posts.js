import pool from "./db.js";

export async function initPosts() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      image_url TEXT,
      caption TEXT,
      visibility TEXT DEFAULT 'public',
      type TEXT DEFAULT 'post',
      parent_id UUID,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("POSTS TABLE READY (V2)");
}
