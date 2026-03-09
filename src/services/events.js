export async function trackEvent(fastify,type,userId,entityId,metadata={}){

await fastify.pg.query(
`INSERT INTO events (type,user_id,entity_id,metadata)
VALUES ($1,$2,$3,$4)`,
[type,userId,entityId,metadata]
);

}
