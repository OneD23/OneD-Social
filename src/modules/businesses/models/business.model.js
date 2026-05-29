import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    logoUrl: { type: String, default: '' },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    description: { type: String, default: '', maxlength: 1000 },
    location: { type: String, required: true, trim: true, maxlength: 160, index: true },
    phone: { type: String, default: '', maxlength: 30 },
    whatsapp: { type: String, default: '', maxlength: 30 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active', index: true },
    verified: { type: Boolean, default: false, index: true },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

businessSchema.index({ name: 'text', category: 'text', description: 'text', location: 'text' });

export const Business = mongoose.model('Business', businessSchema);
