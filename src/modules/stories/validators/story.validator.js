import { z } from 'zod';
export const createStorySchema = z.object({ body: z.object({ media: z.string().optional(), mediaType: z.enum(['image', 'video']), mediaUrl: z.string().url(), caption: z.string().max(500).optional().default('') }) });
