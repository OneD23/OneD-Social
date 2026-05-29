import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, type: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad'], required: true } }, { timestamps: true });
const replySchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, text: { type: String, required: true, maxlength: 500 } }, { timestamps: true });

const storySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    media: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    mediaUrl: { type: String, required: true },
    caption: { type: String, default: '', maxlength: 500 },
    reactions: { type: [reactionSchema], default: [] },
    replies: { type: [replySchema], default: [] },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);
storySchema.index({ caption: 'text' });
export const Story = mongoose.model('Story', storySchema);
