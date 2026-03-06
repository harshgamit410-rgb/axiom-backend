export default async function (fastify) {

  /* USERS TABLE */
  fastify.get("/__migrate_users", async () => {

    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        plan TEXT DEFAULT 'free',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return { migrated_users: true };

  });

  /* POSTS TABLE */
  fastify.get("/__migrate_posts", async () => {

    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        content TEXT,
        image_url TEXT,
        caption TEXT,
        visibility TEXT DEFAULT 'public',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return { migrated_posts: true };

  });

  /* WORKSPACE TABLE */
  fastify.get("/__create_workspace_tables", async () => {

    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS workspace_drafts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        title TEXT,
        type TEXT,
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return { workspace_tables: "created" };

  });

  /* APPS TABLE */
  fastify.get("/__create_apps_table", async () => {

    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS apps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT,
        type TEXT,
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return { apps_table: "created" };

  });

  /* INSTALLS TABLE */
  fastify.get("/__create_installs_table", async () => {

    await fastify.pg.query(`
      CREATE TABLE IF NOT EXISTS app_installs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        app_id UUID,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return { installs_table: "created" };

  });

}
