import { z } from 'zod';
export const marketplaceSchema = z.object({ body: z.object({}).passthrough() });
