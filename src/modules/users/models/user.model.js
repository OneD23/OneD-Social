import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 40 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 280 },
    location: { type: String, default: '', maxlength: 120 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    refreshTokens: { type: [refreshTokenSchema], select: false, default: [] },
    role: { type: String, enum: ['user', 'moderator', 'admin', 'superadmin'], default: 'user', index: true },
    verified: { type: Boolean, default: false, index: true },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['active', 'disabled', 'banned'], default: 'active', index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.refreshTokens;
  user.followersCount = user.followers?.length || 0;
  user.followingCount = user.following?.length || 0;
  return user;
};

userSchema.index({ name: 'text', username: 'text', bio: 'text', location: 'text' });

export const User = mongoose.model('User', userSchema);
