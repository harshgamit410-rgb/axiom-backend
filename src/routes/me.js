import { authGuard } from "../middleware/auth.js";

export default async function (app) {
  app.get("/me", { preHandler: authGuard }, async (req) => {
    return { user: req.user };
  });
}
