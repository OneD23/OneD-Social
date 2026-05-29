import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { validate } from '../../../middleware/validate.js';
import * as controller from '../controllers/business.controller.js';
import { businessSchema } from '../validators/business.validator.js';

const router = Router();

router.get('/', controller.listBusinesses);
router.post('/', authenticate, validate(businessSchema), controller.createBusiness);
router.get('/:businessId', controller.getBusiness);
router.get('/:businessId/posts', controller.listBusinessPosts);

export default router;
