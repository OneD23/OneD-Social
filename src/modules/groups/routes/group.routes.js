import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { validate } from '../../../middleware/validate.js';
import * as controller from '../controllers/group.controller.js';
import { groupSchema } from '../validators/group.validator.js';

const router = Router();

router.get('/', controller.listGroups);
router.post('/', authenticate, validate(groupSchema), controller.createGroup);
router.post('/:groupId/join', authenticate, controller.joinGroup);
router.delete('/:groupId/join', authenticate, controller.leaveGroup);
router.get('/:groupId/posts', controller.listGroupPosts);

export default router;
