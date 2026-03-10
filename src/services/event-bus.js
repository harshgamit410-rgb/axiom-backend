export async function emitEvent(fastify,type,data){

await fastify.pg.query(
"INSERT INTO events (type,metadata) VALUES ($1,$2)",
[type,data]
);

}
