import { Business } from '../../businesses/models/business.model.js';
import { Post } from '../../posts/models/post.model.js';
import { User } from '../../users/models/user.model.js';

const startOfDay = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };

export const dashboard = async () => {
  const today = startOfDay();
  const [usersActive, postsDaily, businessesActive, totals] = await Promise.all([
    User.countDocuments({ status: 'active', deletedAt: null }),
    Post.countDocuments({ createdAt: { $gte: today }, deletedAt: null }),
    Business.countDocuments({ status: 'active', deletedAt: null }),
    Post.aggregate([{ $match: { deletedAt: null } }, { $group: { _id: null, likes: { $sum: { $size: '$likes' } }, comments: { $sum: { $size: '$comments' } }, shares: { $sum: '$sharesCount' }, posts: { $sum: 1 } } }]),
  ]);
  const engagement = totals[0] || { likes: 0, comments: 0, shares: 0, posts: 0 };
  return { usersActive, postsDaily, businessesActive, engagement: { ...engagement, rate: engagement.posts ? (engagement.likes + engagement.comments + engagement.shares) / engagement.posts : 0 } };
};
