export default async function (fastify){

fastify.post("/share", async (req)=>{

const {fileId,userId,visibility} = req.body

const result = await fastify.pg.query(
"INSERT INTO shares (file_id,user_id,visibility) VALUES ($1,$2,$3) RETURNING *",
[fileId,userId,visibility || "public"]
)

return {share:result.rows[0]}

})

fastify.get("/feed", async ()=>{

const result = await fastify.pg.query(
"SELECT workspace_files.*,shares.user_id FROM shares JOIN workspace_files ON workspace_files.id = shares.file_id ORDER BY shares.created_at DESC"
)

return {feed:result.rows}

})

}

export async function likeRoute(fastify){

fastify.post("/like", async (req)=>{

const {shareId,userId} = req.body

await fastify.pg.query(
"INSERT INTO likes (share_id,user_id) VALUES ($1,$2)",
[shareId,userId]
)

return {liked:true}

})

}

export async function commentRoute(fastify){

fastify.post("/comment", async (req)=>{

const {shareId,userId,content} = req.body

await fastify.pg.query(
"INSERT INTO comments (share_id,user_id,content) VALUES ($1,$2,$3)",
[shareId,userId,content]
)

return {commented:true}

})

}

export async function followRoute(fastify){

fastify.post("/follow", async (req)=>{

const {followerId,followingId} = req.body

await fastify.pg.query(
"INSERT INTO follows (follower_id,following_id) VALUES ($1,$2)",
[followerId,followingId]
)

return {following:true}

})

}

export async function notificationRoute(fastify){

fastify.get("/notifications/:userId", async (req)=>{

const {userId} = req.params

const result = await fastify.pg.query(
"SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC",
[userId]
)

return {notifications:result.rows}

})

}

export async function messageRoute(fastify){

fastify.post("/message", async (req)=>{

const {senderId,receiverId,content} = req.body

const result = await fastify.pg.query(
"INSERT INTO messages (sender_id,receiver_id,content) VALUES ($1,$2,$3) RETURNING *",
[senderId,receiverId,content]
)

return {message:result.rows[0]}

})

fastify.get("/messages/:userId", async (req)=>{

const {userId} = req.params

const result = await fastify.pg.query(
"SELECT * FROM messages WHERE sender_id=$1 OR receiver_id=$1 ORDER BY created_at DESC",
[userId]
)

return {messages:result.rows}

})

}

export async function bookmarkRoute(fastify){

fastify.post("/bookmark", async (req)=>{

const {userId,fileId} = req.body

await fastify.pg.query(
"INSERT INTO bookmarks (user_id,file_id) VALUES ($1,$2)",
[userId,fileId]
)

return {bookmarked:true}

})

fastify.get("/bookmarks/:userId", async (req)=>{

const {userId} = req.params

const result = await fastify.pg.query(
"SELECT workspace_files.* FROM bookmarks JOIN workspace_files ON workspace_files.id=bookmarks.file_id WHERE bookmarks.user_id=$1 ORDER BY bookmarks.created_at DESC",
[userId]
)

return {bookmarks:result.rows}

})

}

export async function reportRoute(fastify){

fastify.post("/report", async (req)=>{

const {userId,entityType,entityId,reason} = req.body

await fastify.pg.query(
"INSERT INTO reports (user_id,entity_type,entity_id,reason) VALUES ($1,$2,$3,$4)",
[userId,entityType,entityId,reason]
)

return {reported:true}

})

}

export async function tagRoute(fastify){

fastify.post("/tag", async (req)=>{

const {fileId,tag} = req.body

let tagResult = await fastify.pg.query(
"INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
[tag]
)

const tagId = tagResult.rows[0].id

await fastify.pg.query(
"INSERT INTO file_tags (file_id,tag_id) VALUES ($1,$2)",
[fileId,tagId]
)

return {tagged:true}

})

fastify.get("/tags/:fileId", async (req)=>{

const {fileId} = req.params

const result = await fastify.pg.query(
"SELECT tags.name FROM file_tags JOIN tags ON tags.id=file_tags.tag_id WHERE file_tags.file_id=$1",
[fileId]
)

return {tags:result.rows}

})

}
