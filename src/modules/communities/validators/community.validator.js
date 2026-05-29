import { z } from 'zod';
export const communitySchema = z.object({ body: z.object({}).passthrough() });
