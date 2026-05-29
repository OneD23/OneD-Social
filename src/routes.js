import { Router } from 'express';
import authRoutes from './modules/auth/routes/auth.routes.js';
import businessRoutes from './modules/businesses/routes/business.routes.js';
import feedRoutes from './modules/feed/routes/feed.routes.js';
import groupRoutes from './modules/groups/routes/group.routes.js';
import notificationRoutes from './modules/notifications/routes/notification.routes.js';
import postRoutes from './modules/posts/routes/post.routes.js';
import userRoutes from './modules/users/routes/user.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'oned-social-api' }));
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/businesses', businessRoutes);
router.use('/groups', groupRoutes);
router.use('/feed', feedRoutes);
router.use('/notifications', notificationRoutes);

export default router;
