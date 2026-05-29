import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    comment: { type: String, default: '', maxlength: 1000 },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);
shareSchema.index({ post: 1, user: 1, group: 1 });
export const Share = mongoose.model('Share', shareSchema);
