import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/rbac.js';
import * as controller from '../controllers/analytics.controller.js';
const router=Router();
router.get('/dashboard', authenticate, requireRole('admin'), controller.dashboard);
export default router;
