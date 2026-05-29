import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as service from '../services/search.service.js';
export const search = asyncHandler(async (req, res) => res.json(await service.globalSearch(req.query.q, Number(req.query.limit) || 10)));
