import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/chat.service.js';
export const createConversation = asyncHandler(async (req, res) => res.status(201).json(await service.createConversation(req.user._id, req.body)));
export const listConversations = asyncHandler(async (req, res) => res.json(await service.listConversations(req.user._id, req.query)));
export const listMessages = asyncHandler(async (req, res) => res.json(await service.listMessages(req.params.conversationId, req.user._id, req.query)));
export const sendMessage = asyncHandler(async (req, res) => res.status(201).json(await service.sendMessage(req.user._id, req.body)));
export const markRead = asyncHandler(async (req, res) => res.json(await service.markRead(req.params.conversationId, req.user._id)));
