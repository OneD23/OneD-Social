import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { ApiError } from '../../../utils/ApiError.js';
import { User } from '../../users/models/user.model.js';

const refreshExpiresAt = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
const hashToken = (token) => bcrypt.hash(token, 10);
const compareToken = (token, hash) => bcrypt.compare(token, hash);

const signTokens = async (user) => {
  const accessToken = jwt.sign({ sub: user._id.toString() }, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn });
  const refreshToken = jwt.sign({ sub: user._id.toString(), typ: 'refresh' }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
  user.refreshTokens.push({ tokenHash: await hashToken(refreshToken), expiresAt: refreshExpiresAt() });
  await user.save();
  return { accessToken, refreshToken };
};

export const register = async (payload) => {
  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({ ...payload, passwordHash });
  const tokens = await signTokens(user);
  return { user: user.toPublicJSON(), tokens };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash +refreshTokens');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
  const tokens = await signTokens(user);
  return { user: user.toPublicJSON(), tokens };
};

export const refresh = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.sub).select('+refreshTokens');
  if (!user) throw new ApiError(401, 'Invalid refresh token');

  const activeTokens = user.refreshTokens.filter((token) => token.expiresAt > new Date());
  const tokenMatches = await Promise.all(activeTokens.map((token) => compareToken(refreshToken, token.tokenHash)));
  if (!tokenMatches.some(Boolean)) throw new ApiError(401, 'Refresh token revoked');

  user.refreshTokens = activeTokens.filter((_, index) => !tokenMatches[index]);
  const tokens = await signTokens(user);
  return { user: user.toPublicJSON(), tokens };
};

export const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;
  if (!refreshToken) {
    user.refreshTokens = [];
  } else {
    const matches = await Promise.all(user.refreshTokens.map((token) => compareToken(refreshToken, token.tokenHash)));
    user.refreshTokens = user.refreshTokens.filter((_, index) => !matches[index]);
  }
  await user.save();
};
