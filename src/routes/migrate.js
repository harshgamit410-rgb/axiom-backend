export default async function (fastify) {
  fastify.get("/__migrate_ai_v1", async () => {
    if (!fastify.pg) return { error: "PG NOT REGISTERED" };

    const pool = fastify.pg.pool;

    await pool.query(`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS prompt TEXT;
    `);

    await pool.query(`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;
    `);

    return { migrated: true };
  });
}
