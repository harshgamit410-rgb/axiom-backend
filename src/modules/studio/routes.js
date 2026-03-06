export default async function (fastify){

fastify.post("/studio/create", async (req,reply)=>{

const {title,prompt}=req.body

const user=req.user?.userId || null

const result=await fastify.pg.query(
`INSERT INTO ai_tools (user_id,title,prompt_template)
VALUES ($1,$2,$3)
RETURNING *`,
[user,title,prompt]
)

return {tool:result.rows[0]}

})

fastify.get("/studio/tools", async ()=>{

const result=await fastify.pg.query(
"SELECT * FROM ai_tools ORDER BY created_at DESC"
)

return {tools:result.rows}

})

}
