import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/story.service.js';
export const createStory = asyncHandler(async (req, res) => res.status(201).json(await service.createStory(req.user._id, req.body)));
export const listStories = asyncHandler(async (req, res) => res.json(await service.listStories(req.query)));
export const listUserStories = asyncHandler(async (req, res) => res.json(await service.listUserStories(req.params.userId, req.user?._id, req.query)));
