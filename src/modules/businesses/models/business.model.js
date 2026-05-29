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
  },
  { timestamps: true },
);

export const Business = mongoose.model('Business', businessSchema);
