import { z } from 'zod';
export const jobSchema = z.object({ body: z.object({}).passthrough() });
