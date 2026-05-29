import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import * as controller from '../controllers/feed.controller.js';

const router = Router();

router.get('/general', controller.generalFeed);
router.get('/following', authenticate, controller.followingFeed);
router.get('/businesses', controller.businessFeed);
router.get('/smart', controller.smartFeed);

export default router;
