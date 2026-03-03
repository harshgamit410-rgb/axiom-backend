export default async function (fastify) {

  fastify.get("/__migrate_all", async () => {

    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        role TEXT DEFAULT 'user',
        plan TEXT DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return { migrated: true };
  });

  fastify.get("/__upgrade_posts_v2", async () => {

    await fastify.pg.query(`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS content TEXT;
    `);

    return { upgraded: true };
  });

  fastify.get("/__fix_posts_constraints", async () => {

    await fastify.pg.query(`
      ALTER TABLE posts
      ALTER COLUMN image_url DROP NOT NULL;
    `);

    return { fixed: true };
  });

}
