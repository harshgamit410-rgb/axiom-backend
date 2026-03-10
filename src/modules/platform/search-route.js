import { searchPlatform } from "./search.js";

export default async function searchRoute(fastify){

fastify.get("/search", async (req)=>{

const { q } = req.query;

if(!q) return {results:[]};

const results = await searchPlatform(fastify,q);

return {results};

});

}
