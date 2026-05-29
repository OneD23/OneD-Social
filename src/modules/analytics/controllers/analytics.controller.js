import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/analytics.service.js';
export const dashboard = asyncHandler(async (_req, res) => res.json(await service.dashboard()));
