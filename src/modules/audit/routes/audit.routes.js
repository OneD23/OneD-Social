import { Router } from 'express';
import { requireRole } from '../../../middleware/rbac.js';
import { AuditLog } from '../models/auditLog.model.js';

const router = Router();
router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit).populate('actor', 'name username role');
    res.json({ items: logs });
  } catch (error) { next(error); }
});
export default router;
