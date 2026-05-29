import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../../middleware/auth.js';
import { uploadLimiter } from '../../../security/rateLimiters.js';
import * as controller from '../controllers/media.controller.js';
import { maxFileBytes } from '../validators/media.validator.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxFileBytes, files: 1 } });

router.post('/upload', authenticate, uploadLimiter, upload.single('file'), controller.upload);
router.delete('/:id', authenticate, controller.remove);

export default router;
