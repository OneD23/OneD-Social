import { z } from 'zod';
export const eventSchema = z.object({ body: z.object({}).passthrough() });
