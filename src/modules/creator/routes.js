export default async function creatorRoutes(fastify){

fastify.get("/creator/stats/:creatorId", async (req)=>{

const {creatorId}=req.params;

const tools=await fastify.pg.query(
"SELECT COUNT(*) FROM ai_tools WHERE user_id=$1",
[creatorId]
);

const earnings=await fastify.pg.query(
`SELECT 
COALESCE(SUM(runs),0) as runs,
COALESCE(SUM(revenue),0) as revenue
FROM creator_earnings
WHERE creator_id=$1`,
[creatorId]
);

return{
tools:parseInt(tools.rows[0].count),
total_runs:parseInt(earnings.rows[0].runs),
total_revenue:parseFloat(earnings.rows[0].revenue)
};

});

}
