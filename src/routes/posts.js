import { authGuard } from "../middleware/auth.js";
import { createPost, listPosts, listFeed, deletePost } from "../store/posts.js";
import { likePost, unlikePost, countLikes, likedBy } from "../store/likes.js";

export default async function (app) {
  app.get("/likes-proof", async () => {
    return { ok: "POSTS_WITH_LIKES_LOADED" };
  });


  // create
  app.post("/posts", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    const { content } = req.body;
    const post = createPost(user.id, content);
    return { post };
  });

  // my posts
  app.get("/posts", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    return { posts: listPosts(user.id) };
  });

  // feed
  app.get("/feed", { preHandler: authGuard }, async () => {
  app.get("/debug-likes", async () => ({ ok: "likes file loaded" }));
    return { posts: listFeed() };
  });

  // delete
  app.delete("/posts/:id", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    const ok = deletePost(user.id, req.params.id);
    return { success: ok };
  });

  // ❤️ like
  app.post("/posts/:id/like", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    const count = likePost(req.params.id, user.id);
    return { liked: true, count };
  });

  // 💔 unlike
  app.delete("/posts/:id/like", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    const count = unlikePost(req.params.id, user.id);
    return { liked: false, count };
  });

  // count
  app.get("/posts/:id/likes", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    return {
      count: countLikes(req.params.id),
      liked: likedBy(req.params.id, user.id)
    };
  });

}
