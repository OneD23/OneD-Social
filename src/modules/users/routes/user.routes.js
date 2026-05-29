import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { validate } from '../../../middleware/validate.js';
import * as controller from '../controllers/user.controller.js';
import { updateProfileSchema } from '../validators/user.validator.js';

const router = Router();

router.get('/me', authenticate, controller.me);
router.patch('/me', authenticate, validate(updateProfileSchema), controller.updateProfile);
router.get('/:username', controller.getPublicProfile);
router.post('/:userId/follow', authenticate, controller.follow);
router.delete('/:userId/follow', authenticate, controller.unfollow);

export default router;
