import { emitToUser } from '../../../realtime/socket.js';
import { Notification } from '../models/notification.model.js';

export const createAndEmitNotification = async (payload) => {
  const notification = await Notification.create(payload);
  emitToUser(payload.recipient, `notification:${payload.type}`, notification);
  return notification;
};
