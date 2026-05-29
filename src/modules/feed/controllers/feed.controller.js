import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/feed.service.js';

export const generalFeed = asyncHandler(async (req, res) => res.json(await service.generalFeed(req.query)));
export const followingFeed = asyncHandler(async (req, res) => res.json(await service.followingFeed(req.user._id, req.query)));
export const businessFeed = asyncHandler(async (req, res) => res.json(await service.businessFeed(req.query)));
