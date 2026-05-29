import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { Post } from '../../posts/models/post.model.js';
import { User } from '../../users/models/user.model.js';

const populateFeed = (query) => query.populate('author', 'name username avatarUrl').populate('business', 'name logoUrl category').populate('group', 'name scope location topic');

const list = async (query, filter) => {
  const { page, limit, skip } = getPagination(query);
  const sort = query.sort === 'relevance' ? { score: -1, createdAt: -1 } : { createdAt: -1 };
  const [items, total] = await Promise.all([populateFeed(Post.find(filter).sort(sort).skip(skip).limit(limit)), Post.countDocuments(filter)]);
  return paginatedResponse(items, total, page, limit);
};

export const generalFeed = (query) => list(query, { group: null });
export const businessFeed = (query) => list(query, { business: { $ne: null }, group: null });

export const followingFeed = async (userId, query) => {
  const user = await User.findById(userId).select('following');
  return list(query, { author: { $in: user.following }, group: null });
};
