import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/media.service.js';

export const upload = asyncHandler(async (req, res) => res.status(201).json(await service.uploadMedia(req.user._id, req.file, req)));
export const remove = asyncHandler(async (req, res) => res.json(await service.deleteMedia(req.user._id, req.params.id, req)));
