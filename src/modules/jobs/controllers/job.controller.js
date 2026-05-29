import { asyncHandler } from '../../../utils/asyncHandler.js';
import { service } from '../services/job.service.js';
export const create = asyncHandler(async (req, res) => res.status(201).json(await service.create(req.user._id, req.body)));
export const list = asyncHandler(async (req, res) => res.json(await service.list(req.query)));
export const get = asyncHandler(async (req, res) => res.json(await service.get(req.params.id)));
export const update = asyncHandler(async (req, res) => res.json(await service.update(req.params.id, req.user._id, req.body)));
export const remove = asyncHandler(async (req, res) => res.json(await service.remove(req.params.id, req.user._id)));
