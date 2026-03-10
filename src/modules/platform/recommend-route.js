import { recommendTools } from "./recommend.js";

export default async function recommendRoute(fastify){

fastify.get("/platform/recommend/:userId", async (req)=>{

const { userId } = req.params;

const tools = await recommendTools(fastify,userId);

return {recommended:tools};

});

}
