import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { Post } from '../../posts/models/post.model.js';
import { User } from '../../users/models/user.model.js';
import { sortRankedPosts } from './feedRanking.service.js';

const populateFeed = (query) => query.populate('author', 'name username avatarUrl').populate('business', 'name logoUrl category').populate('group', 'name scope location topic');

const list = async (query, filter, viewer = null) => {
  const { page, limit, skip } = getPagination(query);
  const sort = query.sort === 'relevance' ? { score: -1, createdAt: -1 } : { createdAt: -1 };
  const fetchLimit = query.sort === 'smart' ? Math.min(limit * 3, 100) : limit;
  const [items, total] = await Promise.all([populateFeed(Post.find(filter).sort(sort).skip(skip).limit(fetchLimit)), Post.countDocuments(filter)]);
  const ranked = query.sort === 'smart' ? sortRankedPosts(items, viewer).slice(0, limit) : items;
  return paginatedResponse(ranked, total, page, limit);
};

export const generalFeed = (query) => list(query, { group: null });
export const businessFeed = (query) => list(query, { business: { $ne: null }, group: null });

export const followingFeed = async (userId, query) => {
  const user = await User.findById(userId).select('following location');
  return list(query, { author: { $in: user.following }, group: null }, user);
};

export const smartFeed = async (userId, query) => {
  const user = userId ? await User.findById(userId).select('following location') : null;
  return list({ ...query, sort: 'smart' }, { group: null }, user);
};
