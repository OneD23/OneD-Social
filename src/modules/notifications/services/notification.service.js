import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { Notification } from '../models/notification.model.js';

export const listNotifications = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { recipient: userId };
  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('actor', 'name username avatarUrl').populate('post', 'text').populate('group', 'name'),
    Notification.countDocuments(filter),
  ]);
  return paginatedResponse(items, total, page, limit);
};

export const markRead = (userId, notificationId) => Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { readAt: new Date() }, { new: true });
