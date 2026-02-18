import { authGuard } from "../middleware/auth.js";
import { getProfile } from "../store/profile.js";
import { listFeed } from "../store/posts.js";

export default async function (app) {
  app.get("/users/:id", { preHandler: authGuard }, async (req) => {
    const userId = req.params.id;

    const profile = getProfile(userId, "");
    const posts = listFeed().filter(p => p.userId === userId);

    return { profile, posts };
  });
}
