import { verifyToken } from "../services/authMiddleware.js";

export default async function (fastify) {

  fastify.get("/me", { preHandler: verifyToken }, async (request) => {
    return {
      userId: request.user.userId,
      role: request.user.role,
      plan: request.user.plan
    };
  });

}
