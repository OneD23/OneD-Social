import { ApiError } from '../../../utils/ApiError.js';
import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { emitToConversation, emitToUser } from '../../../realtime/socket.js';
import { Notification } from '../../notifications/models/notification.model.js';
import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';

const assertParticipant = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({ _id: conversationId, 'participants.user': userId, deletedAt: null });
  if (!conversation) throw new ApiError(403, 'Conversation not found or access denied');
  return conversation;
};

export const createConversation = async (creatorId, payload) => {
  const participantIds = [...new Set([creatorId.toString(), ...payload.participantIds])];
  if (payload.type === 'private' && participantIds.length !== 2) throw new ApiError(400, 'Private conversations require exactly two participants');
  const conversation = await Conversation.create({ type: payload.type, title: payload.title || '', participants: participantIds.map((user) => ({ user, role: user === creatorId.toString() ? 'admin' : 'member' })) });
  participantIds.forEach((userId) => emitToUser(userId, 'chat:conversation_created', conversation));
  return conversation;
};

export const listConversations = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { 'participants.user': userId, deletedAt: null };
  const [items, total] = await Promise.all([Conversation.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('participants.user', 'name username avatarUrl verified').populate('lastMessage'), Conversation.countDocuments(filter)]);
  return paginatedResponse(items, total, page, limit);
};

export const listMessages = async (conversationId, userId, query) => {
  await assertParticipant(conversationId, userId);
  const { page, limit, skip } = getPagination(query);
  const filter = { conversation: conversationId, deletedAt: null };
  const [items, total] = await Promise.all([Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('sender', 'name username avatarUrl verified').populate('replyTo'), Message.countDocuments(filter)]);
  return paginatedResponse(items.reverse(), total, page, limit);
};

export const sendMessage = async (senderId, payload) => {
  const conversation = await assertParticipant(payload.conversationId, senderId);
  const message = await Message.create({ conversation: conversation._id, sender: senderId, text: payload.text, attachments: payload.attachments, replyTo: payload.replyTo, readBy: [{ user: senderId }] });
  conversation.lastMessage = message._id;
  await conversation.save();
  const populated = await Message.findById(message._id).populate('sender', 'name username avatarUrl verified');
  emitToConversation(conversation._id, 'chat:message', populated);
  const recipients = conversation.participants.filter((p) => p.user.toString() !== senderId.toString()).map((p) => p.user);
  await Notification.insertMany(recipients.map((recipient) => ({ recipient, actor: senderId, type: 'message' })), { ordered: false });
  recipients.forEach((recipient) => emitToUser(recipient, 'notification:message', populated));
  return populated;
};

export const markRead = async (conversationId, userId) => {
  const conversation = await assertParticipant(conversationId, userId);
  await Conversation.updateOne({ _id: conversationId, 'participants.user': userId }, { $set: { 'participants.$.lastReadAt': new Date() } });
  emitToConversation(conversation._id, 'chat:read', { conversationId, userId });
  return { read: true };
};

export const softDeleteMessage = async (messageId, userId) => {
  const message = await Message.findOneAndUpdate({ _id: messageId, sender: userId, deletedAt: null }, { deletedAt: new Date() }, { new: true });
  if (!message) throw new ApiError(404, 'Message not found');
  emitToConversation(message.conversation, 'chat:message_deleted', { messageId });
  return { deleted: true };
};
