import { cloudinary } from '../../../config/cloudinary.js';
import { ApiError } from '../../../utils/ApiError.js';
import { allowedMimeTypes, maxFileBytes } from '../validators/media.validator.js';
import { MediaAsset } from '../models/mediaAsset.model.js';
import { writeAuditLog } from '../../audit/services/audit.service.js';

const inferKind = (mimeType) => (mimeType.startsWith('video/') ? 'video' : 'image');
const dataUri = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

const validateFile = (file) => {
  if (!file) throw new ApiError(400, 'File is required');
  if (!allowedMimeTypes.has(file.mimetype)) throw new ApiError(415, 'Unsupported file type');
  if (file.size > maxFileBytes) throw new ApiError(413, 'File exceeds size limit');
  if (!file.buffer?.length) throw new ApiError(400, 'Invalid file payload');
};

export const uploadMedia = async (userId, file, req) => {
  validateFile(file);
  const kind = inferKind(file.mimetype);
  const resourceType = kind === 'video' ? 'video' : 'image';
  const upload = await cloudinary.uploader.upload(dataUri(file), {
    folder: `oned-social/${kind}s`,
    resource_type: resourceType,
    quality: 'auto',
    fetch_format: 'auto',
    eager: kind === 'video' ? [{ width: 640, crop: 'scale', format: 'jpg', resource_type: 'video' }] : [{ width: 640, crop: 'scale', quality: 'auto', fetch_format: 'auto' }],
  });
  const asset = await MediaAsset.create({
    owner: userId,
    kind,
    url: upload.url,
    secureUrl: upload.secure_url,
    thumbnailUrl: upload.eager?.[0]?.secure_url || upload.secure_url,
    publicId: upload.public_id,
    bytes: upload.bytes || file.size,
    mimeType: file.mimetype,
    width: upload.width,
    height: upload.height,
    duration: upload.duration,
  });
  await writeAuditLog({ actor: userId, action: 'media.upload', entityType: 'MediaAsset', entityId: asset._id, req });
  return asset;
};

export const deleteMedia = async (userId, mediaId, req) => {
  const asset = await MediaAsset.findOne({ _id: mediaId, owner: userId, deletedAt: null });
  if (!asset) throw new ApiError(404, 'Media asset not found');
  await cloudinary.uploader.destroy(asset.publicId, { resource_type: asset.kind === 'video' ? 'video' : 'image' });
  asset.deletedAt = new Date();
  asset.isOrphan = false;
  await asset.save();
  await writeAuditLog({ actor: userId, action: 'media.delete', entityType: 'MediaAsset', entityId: asset._id, req });
  return { deleted: true };
};

export const cleanupOrphans = async (olderThanHours = 24) => {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
  const assets = await MediaAsset.find({ isOrphan: true, createdAt: { $lt: cutoff }, deletedAt: null }).limit(100);
  for (const asset of assets) {
    await cloudinary.uploader.destroy(asset.publicId, { resource_type: asset.kind === 'video' ? 'video' : 'image' });
    asset.deletedAt = new Date();
    await asset.save();
  }
  return { cleaned: assets.length };
};
