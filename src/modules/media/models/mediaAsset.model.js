import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    kind: { type: String, enum: ['image', 'video'], required: true, index: true },
    url: { type: String, required: true },
    secureUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    publicId: { type: String, required: true, unique: true },
    provider: { type: String, enum: ['cloudinary'], default: 'cloudinary' },
    bytes: { type: Number, required: true },
    mimeType: { type: String, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    duration: { type: Number, default: null },
    attachedTo: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
    attachedModel: { type: String, default: '', index: true },
    isOrphan: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

mediaAssetSchema.index({ createdAt: -1 });

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
