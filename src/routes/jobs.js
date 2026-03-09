export default async function (fastify){

fastify.get("/jobs/:id", async (req)=>{

const {id}=req.params

const result=await fastify.pg.query(
"SELECT id,status,output FROM ai_runs WHERE id=$1",
[id]
)

return result.rows[0]

})

}
