import { getTrendingTools } from "./trending.js";

export default async function trendingRoute(fastify){

fastify.get("/platform/trending", async ()=>{

const tools = await getTrendingTools(fastify);

return {trending:tools};

});

}
