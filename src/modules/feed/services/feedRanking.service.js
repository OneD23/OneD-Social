const hoursSince = (date) => Math.max((Date.now() - new Date(date).getTime()) / 36e5, 1);

export const calculatePostScore = (post, viewer = null) => {
  const likes = post.likes?.length || 0;
  const comments = post.comments?.length || 0;
  const shares = post.sharesCount || 0;
  const freshness = 24 / (hoursSince(post.createdAt) + 2);
  const popularity = likes * 2 + comments * 4 + shares * 5;
  const authorId = post.author?._id?.toString?.() || post.author?.toString?.();
  const affinityAuthor = viewer?.following?.some?.((id) => id.toString() === authorId) ? 15 : 0;
  const affinityBusiness = post.business && viewer?.location && post.business?.location?.toLowerCase?.().includes(viewer.location.toLowerCase()) ? 8 : 0;
  return Number((popularity + freshness + affinityAuthor + affinityBusiness).toFixed(3));
};

export const sortRankedPosts = (posts, viewer) => posts
  .map((post) => ({ post, score: calculatePostScore(post, viewer) }))
  .sort((a, b) => b.score - a.score || new Date(b.post.createdAt) - new Date(a.post.createdAt))
  .map(({ post, score }) => ({ ...(post.toObject?.() || post), dynamicScore: score }));
