import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
  },
  { _id: false },
);

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null, index: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null, index: true },
    text: { type: String, trim: true, maxlength: 2000, default: '' },
    media: { type: [mediaSchema], default: [] },
    type: { type: String, enum: ['user', 'business', 'promotion', 'group'], default: 'user', index: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sharesCount: { type: Number, default: 0, index: true },
    comments: { type: [commentSchema], default: [] },
    score: { type: Number, default: 0, index: true },
    dynamicScore: { type: Number, default: 0, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

postSchema.index({ createdAt: -1 });
postSchema.index({ text: 'text' });

export const Post = mongoose.model('Post', postSchema);
