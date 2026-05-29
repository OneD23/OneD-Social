import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, role: { type: String, enum: ['member', 'admin'], default: 'member' }, lastReadAt: { type: Date, default: null } }, { _id: false });

const conversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['private', 'group'], required: true, index: true },
    title: { type: String, default: '', maxlength: 120 },
    participants: { type: [participantSchema], required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);
conversationSchema.index({ 'participants.user': 1, updatedAt: -1 });
export const Conversation = mongoose.model('Conversation', conversationSchema);
