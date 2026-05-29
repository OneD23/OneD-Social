import { ApiError } from './ApiError.js';
import { getPagination, paginatedResponse } from './pagination.js';

export const createCrudService = (Model, options = {}) => ({
  create: (owner, payload) => Model.create({ ...payload, [options.ownerField || 'owner']: owner }),
  list: async (query) => {
    const { page, limit, skip } = getPagination(query);
    const filter = { deletedAt: null };
    const [items, total] = await Promise.all([Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit), Model.countDocuments(filter)]);
    return paginatedResponse(items, total, page, limit);
  },
  get: async (id) => {
    const item = await Model.findOne({ _id: id, deletedAt: null });
    if (!item) throw new ApiError(404, `${Model.modelName} not found`);
    return item;
  },
  update: async (id, owner, payload) => {
    const item = await Model.findOneAndUpdate({ _id: id, [options.ownerField || 'owner']: owner, deletedAt: null }, payload, { new: true, runValidators: true });
    if (!item) throw new ApiError(404, `${Model.modelName} not found`);
    return item;
  },
  remove: async (id, owner) => {
    const item = await Model.findOneAndUpdate({ _id: id, [options.ownerField || 'owner']: owner, deletedAt: null }, { deletedAt: new Date() }, { new: true });
    if (!item) throw new ApiError(404, `${Model.modelName} not found`);
    return { deleted: true };
  },
});
