import { ApiError } from '../utils/ApiError.js';

export const roles = ['user', 'moderator', 'admin', 'superadmin'];
const rank = new Map(roles.map((role, index) => [role, index]));

export const requireRole = (minimumRole = 'user') => (req, _res, next) => {
  const role = req.user?.role || 'user';
  if ((rank.get(role) ?? 0) < (rank.get(minimumRole) ?? 0)) {
    return next(new ApiError(403, 'Insufficient permissions'));
  }
  return next();
};
