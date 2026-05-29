import { ApiError } from '../../../utils/ApiError.js';
import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { Post } from '../../posts/models/post.model.js';
import { Group } from '../models/group.model.js';

export const createGroup = (owner, payload) => Group.create({ ...payload, owner, members: [owner] });

export const listGroups = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.scope) filter.scope = query.scope;
  if (query.location) filter.location = new RegExp(query.location, 'i');
  if (query.topic) filter.topic = new RegExp(query.topic, 'i');
  const [items, total] = await Promise.all([Group.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('owner', 'name username avatarUrl'), Group.countDocuments(filter)]);
  return paginatedResponse(items, total, page, limit);
};

export const joinGroup = async (groupId, userId) => {
  const group = await Group.findByIdAndUpdate(groupId, { $addToSet: { members: userId } }, { new: true });
  if (!group) throw new ApiError(404, 'Group not found');
  return { joined: true, membersCount: group.members.length };
};

export const leaveGroup = async (groupId, userId) => {
  const group = await Group.findByIdAndUpdate(groupId, { $pull: { members: userId } }, { new: true });
  if (!group) throw new ApiError(404, 'Group not found');
  return { joined: false, membersCount: group.members.length };
};

export const listGroupPosts = async (groupId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { group: groupId };
  const [items, total] = await Promise.all([Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'name username avatarUrl').populate('group', 'name scope location topic'), Post.countDocuments(filter)]);
  return paginatedResponse(items, total, page, limit);
};
