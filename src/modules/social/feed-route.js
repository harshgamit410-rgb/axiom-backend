import { getRankedFeed } from "./feed-ranking.js";

export default async function rankedFeedRoute(fastify){

fastify.get("/feed/ranked", async ()=>{

const feed = await getRankedFeed(fastify);

return {feed};

});

}
