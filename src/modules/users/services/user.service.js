import { ApiError } from '../../../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Notification } from '../../notifications/models/notification.model.js';

const publicSelect = '-passwordHash -refreshTokens';

export const getPublicProfile = async (username) => {
  const user = await User.findOne({ username }).select(publicSelect);
  if (!user) throw new ApiError(404, 'User not found');
  return user.toPublicJSON();
};

export const updateProfile = async (userId, payload) => {
  const user = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select(publicSelect);
  return user.toPublicJSON();
};

export const follow = async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId) throw new ApiError(400, 'You cannot follow yourself');
  const target = await User.findById(targetUserId);
  if (!target) throw new ApiError(404, 'User not found');

  await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: target._id } });
  await User.findByIdAndUpdate(target._id, { $addToSet: { followers: currentUserId } });
  await Notification.create({ recipient: target._id, actor: currentUserId, type: 'follow' });
  return { following: true };
};

export const unfollow = async (currentUserId, targetUserId) => {
  await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
  await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
  return { following: false };
};
