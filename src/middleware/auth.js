import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../modules/users/models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) throw new ApiError(401, 'Authentication required');

    const decoded = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(decoded.sub).select('-passwordHash -refreshTokens');
    if (!user || user.status !== 'active') throw new ApiError(401, 'Invalid authentication token');

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid authentication token'));
  }
};
