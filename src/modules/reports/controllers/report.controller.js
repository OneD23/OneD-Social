import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/report.service.js';
export const createReport = asyncHandler(async (req, res) => res.status(201).json(await service.createReport(req.user._id, req.body, req)));
