export default async function (fastify, opts) {

  fastify.get("/__migrate_ai_v1", async () => {

    const pool = fastify.pg;

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
