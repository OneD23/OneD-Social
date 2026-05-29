import { ApiError } from '../../../utils/ApiError.js';
import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { Post } from '../../posts/models/post.model.js';
import { Business } from '../models/business.model.js';

export const createBusiness = (owner, payload) => Business.create({ ...payload, owner });

export const listBusinesses = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.location) filter.location = new RegExp(query.location, 'i');
  const [items, total] = await Promise.all([Business.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('owner', 'name username avatarUrl'), Business.countDocuments(filter)]);
  return paginatedResponse(items, total, page, limit);
};

export const getBusiness = async (id) => {
  const business = await Business.findById(id).populate('owner', 'name username avatarUrl');
  if (!business) throw new ApiError(404, 'Business not found');
  return business;
};

export const listBusinessPosts = async (businessId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { business: businessId };
  const [items, total] = await Promise.all([Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'name username avatarUrl').populate('business', 'name logoUrl category'), Post.countDocuments(filter)]);
  return paginatedResponse(items, total, page, limit);
};
