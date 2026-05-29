import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/group.service.js';

export const createGroup = asyncHandler(async (req, res) => res.status(201).json(await service.createGroup(req.user._id, req.body)));
export const listGroups = asyncHandler(async (req, res) => res.json(await service.listGroups(req.query)));
export const joinGroup = asyncHandler(async (req, res) => res.json(await service.joinGroup(req.params.groupId, req.user._id)));
export const leaveGroup = asyncHandler(async (req, res) => res.json(await service.leaveGroup(req.params.groupId, req.user._id)));
export const listGroupPosts = asyncHandler(async (req, res) => res.json(await service.listGroupPosts(req.params.groupId, req.query)));
