export default async function (fastify){

fastify.get("/platform/health", async ()=>{

const users = await fastify.pg.query("SELECT COUNT(*) FROM users")
const tools = await fastify.pg.query("SELECT COUNT(*) FROM ai_tools")
const runs = await fastify.pg.query("SELECT COUNT(*) FROM usage_logs")
const revenue = await fastify.pg.query("SELECT SUM(revenue) FROM creator_earnings")

return {
users:users.rows[0].count,
tools:tools.rows[0].count,
runs:runs.rows[0].count,
revenue:revenue.rows[0].sum || 0
}

})

}
