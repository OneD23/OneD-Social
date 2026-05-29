import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import * as controller from '../controllers/notification.controller.js';

const router = Router();

router.get('/', authenticate, controller.listNotifications);
router.patch('/:notificationId/read', authenticate, controller.markRead);

export default router;
