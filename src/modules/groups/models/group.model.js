import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 1000 },
    scope: { type: String, enum: ['neighborhood', 'city', 'topic'], required: true, index: true },
    location: { type: String, default: '', maxlength: 160, index: true },
    topic: { type: String, default: '', maxlength: 80, index: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

groupSchema.index({ name: 'text', description: 'text', location: 'text', topic: 'text' });

export const Group = mongoose.model('Group', groupSchema);
