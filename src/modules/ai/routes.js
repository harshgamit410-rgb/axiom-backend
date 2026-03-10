export async function usageRoute(fastify){

fastify.get("/usage/:userId", async (req)=>{

const {userId} = req.params

const result = await fastify.pg.query(
"SELECT COUNT(*) as runs, SUM(tokens) as tokens, SUM(cost) as cost FROM usage_logs WHERE user_id=$1",
[userId]
)

return {usage:result.rows[0]}

})

}
