import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { validate } from '../../../middleware/validate.js';
import * as controller from '../controllers/report.controller.js';
import { reportSchema } from '../validators/report.validator.js';
const router=Router();
router.post('/', authenticate, validate(reportSchema), controller.createReport);
export default router;
