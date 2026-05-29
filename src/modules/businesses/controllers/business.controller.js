import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/business.service.js';

export const createBusiness = asyncHandler(async (req, res) => res.status(201).json(await service.createBusiness(req.user._id, req.body)));
export const listBusinesses = asyncHandler(async (req, res) => res.json(await service.listBusinesses(req.query)));
export const getBusiness = asyncHandler(async (req, res) => res.json(await service.getBusiness(req.params.businessId)));
export const listBusinessPosts = asyncHandler(async (req, res) => res.json(await service.listBusinessPosts(req.params.businessId, req.query)));
