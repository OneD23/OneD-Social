import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/notification.service.js';

export const listNotifications = asyncHandler(async (req, res) => res.json(await service.listNotifications(req.user._id, req.query)));
export const markRead = asyncHandler(async (req, res) => res.json(await service.markRead(req.user._id, req.params.notificationId)));
