import { getToolRemixes } from "./tool-graph.js";

export default async function toolGraphRoute(fastify){

fastify.get("/tools/remixes/:toolId", async (req)=>{

const { toolId } = req.params;

const remixes = await getToolRemixes(fastify,toolId);

return {remixes};

});

}
