import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({ type: { type: String, enum: ['image', 'video', 'file'], required: true }, url: { type: String, required: true }, media: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', default: null } }, { _id: false });
const readReceiptSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, readAt: { type: Date, default: Date.now } }, { _id: false });

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, default: '', maxlength: 4000 },
    attachments: { type: [attachmentSchema], default: [] },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    readBy: { type: [readReceiptSchema], default: [] },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);
messageSchema.index({ conversation: 1, createdAt: -1 });
export const Message = mongoose.model('Message', messageSchema);
