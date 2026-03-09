export default async function platformRoutes(fastify){

fastify.get("/platform/stats", async ()=>{

const users=await fastify.pg.query(
"SELECT COUNT(*) FROM users"
);

const tools=await fastify.pg.query(
"SELECT COUNT(*) FROM ai_tools"
);

const runs=await fastify.pg.query(
"SELECT COALESCE(SUM(runs),0) FROM creator_earnings"
);

const revenue=await fastify.pg.query(
"SELECT COALESCE(SUM(revenue),0) FROM creator_earnings"
);

return{
total_users:parseInt(users.rows[0].count),
total_tools:parseInt(tools.rows[0].count),
total_runs:parseInt(runs.rows[0].coalesce),
total_revenue:parseFloat(revenue.rows[0].coalesce)
};

});

}
