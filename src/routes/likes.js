import { authGuard } from "../middleware/auth.js";
import { toggleLike, countLikes } from "../store/likes.js";

export default async function (app) {
  app.post("/posts/:id/like", { preHandler: authGuard }, async (req) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const liked = toggleLike(postId, userId);
    return { liked, count: countLikes(postId) };
  });

  app.get("/posts/:id/likes", async (req) => {
    const postId = req.params.id;
    return { count: countLikes(postId) };
  });
}
