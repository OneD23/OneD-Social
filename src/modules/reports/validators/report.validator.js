import { z } from 'zod';
export const reportSchema = z.object({ body: z.object({ targetType: z.enum(['user', 'post', 'business', 'group', 'story', 'message', 'marketplace_item']), targetId: z.string(), reason: z.enum(['spam', 'scam', 'harassment', 'violence', 'nudity', 'illegal_content']), details: z.string().max(1000).optional().default('') }) });
