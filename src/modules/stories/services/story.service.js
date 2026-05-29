import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { Story } from '../models/story.model.js';
import { StoryView } from '../models/storyView.model.js';
import { emitToUser } from '../../../realtime/socket.js';

export const createStory = async (author, payload) => {
  const story = await Story.create({ ...payload, author, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
  emitToUser(author, 'story:created', story);
  return story;
};

export const listStories = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { expiresAt: { $gt: new Date() }, deletedAt: null };
  const [items, total] = await Promise.all([Story.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'name username avatarUrl verified'), Story.countDocuments(filter)]);
  return paginatedResponse(items, total, page, limit);
};

export const listUserStories = async (userId, viewerId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { author: userId, expiresAt: { $gt: new Date() }, deletedAt: null };
  const [items, total] = await Promise.all([Story.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'name username avatarUrl verified'), Story.countDocuments(filter)]);
  if (viewerId) await StoryView.insertMany(items.map((story) => ({ story: story._id, viewer: viewerId })), { ordered: false }).catch(() => undefined);
  return paginatedResponse(items, total, page, limit);
};
