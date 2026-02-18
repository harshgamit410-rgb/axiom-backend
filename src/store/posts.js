const posts = [];

export function createPost(userId, content) {
  const post = {
    id: "p_" + Date.now(),
    userId,
    content,
    createdAt: Date.now()
  };
  posts.push(post);
  return post;
}

export function listPosts(userId) {
  return posts.filter(p => p.userId === userId);
}

export function listFeed() {
  return posts.sort((a,b)=>b.createdAt-a.createdAt);
}

export function deletePost(userId, postId) {
  const index = posts.findIndex(p => p.id === postId && p.userId === userId);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
}
