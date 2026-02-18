const likes = new Map();
// postId -> Set(userId)

export function toggleLike(postId, userId) {
  if (!likes.has(postId)) likes.set(postId, new Set());

  const set = likes.get(postId);

  if (set.has(userId)) {
    set.delete(userId);
    return false; // unliked
  }

  set.add(userId);
  return true; // liked
}

export function countLikes(postId) {
  return likes.get(postId)?.size || 0;
}
