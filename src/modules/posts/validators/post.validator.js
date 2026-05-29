import { z } from 'zod';

const media = z.object({ type: z.enum(['image', 'video']), url: z.string().url(), publicId: z.string().optional() });

export const createPostSchema = z.object({
  body: z.object({
    text: z.string().max(2000).optional().default(''),
    media: z.array(media).max(10).optional().default([]),
    business: z.string().optional(),
    group: z.string().optional(),
    type: z.enum(['user', 'business', 'promotion', 'group']).optional(),
  }).refine((value) => value.text || value.media.length, { message: 'Post requires text or media' }),
});

export const updatePostSchema = z.object({
  body: z.object({
    text: z.string().max(2000).optional(),
    media: z.array(media).max(10).optional(),
  }),
});

export const commentSchema = z.object({ body: z.object({ text: z.string().min(1).max(500) }) });

export const sharePostSchema = z.object({ body: z.object({ comment: z.string().max(1000).optional().default(''), group: z.string().optional() }) });
