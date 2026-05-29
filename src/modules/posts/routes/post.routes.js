import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.js';
import { validate } from '../../../middleware/validate.js';
import * as controller from '../controllers/post.controller.js';
import { commentSchema, createPostSchema, sharePostSchema, updatePostSchema } from '../validators/post.validator.js';

const router = Router();

router.get('/', controller.listFeed);
router.post('/', authenticate, validate(createPostSchema), controller.createPost);
router.get('/user/:userId', controller.byUser);
router.patch('/:postId', authenticate, validate(updatePostSchema), controller.updatePost);
router.delete('/:postId', authenticate, controller.deletePost);
router.post('/:postId/like', authenticate, controller.toggleLike);
router.post('/:postId/comments', authenticate, validate(commentSchema), controller.addComment);
router.post('/:id/share', authenticate, validate(sharePostSchema), controller.sharePost);

export default router;
