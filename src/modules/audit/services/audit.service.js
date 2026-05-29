import { AuditLog } from '../models/auditLog.model.js';

export const writeAuditLog = async ({ actor, action, entityType, entityId, req, metadata = {} }) => {
  try {
    await AuditLog.create({
      actor: actor || req?.user?._id || null,
      action,
      entityType,
      entityId: entityId || null,
      ip: req?.ip || '',
      userAgent: req?.headers?.['user-agent'] || '',
      metadata,
    });
  } catch (error) {
    console.error('Audit log failed', error.message);
  }
};
