import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const me = asyncHandler(async (req, res) => {
  res.json(req.user.toPublicJSON());
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  res.json(await userService.getPublicProfile(req.params.username));
});

export const updateProfile = asyncHandler(async (req, res) => {
  res.json(await userService.updateProfile(req.user._id, req.body));
});

export const follow = asyncHandler(async (req, res) => {
  res.json(await userService.follow(req.user._id, req.params.userId));
});

export const unfollow = asyncHandler(async (req, res) => {
  res.json(await userService.unfollow(req.user._id, req.params.userId));
});
