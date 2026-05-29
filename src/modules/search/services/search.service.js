import { Business } from '../../businesses/models/business.model.js';
import { Group } from '../../groups/models/group.model.js';
import { Post } from '../../posts/models/post.model.js';
import { Story } from '../../stories/models/story.model.js';
import { User } from '../../users/models/user.model.js';

export const globalSearch = async (q, limit = 10) => {
  const text = q?.trim();
  if (!text) return { users: [], businesses: [], posts: [], groups: [], stories: [] };
  const projection = { score: { $meta: 'textScore' } };
  const sort = { score: { $meta: 'textScore' } };
  const [users, businesses, posts, groups, stories] = await Promise.all([
    User.find({ $text: { $search: text }, deletedAt: null }).select('name username avatarUrl bio location verified').sort(sort).limit(limit),
    Business.find({ $text: { $search: text }, deletedAt: null, status: 'active' }, projection).sort(sort).limit(limit),
    Post.find({ $text: { $search: text }, deletedAt: null }, projection).sort(sort).limit(limit).populate('author', 'name username avatarUrl verified'),
    Group.find({ $text: { $search: text }, deletedAt: null }, projection).sort(sort).limit(limit),
    Story.find({ $text: { $search: text }, expiresAt: { $gt: new Date() }, deletedAt: null }, projection).sort(sort).limit(limit).populate('author', 'name username avatarUrl verified'),
  ]);
  return { users, businesses, posts, groups, stories };
};
