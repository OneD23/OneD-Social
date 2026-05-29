import { z } from 'zod';

export const groupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    description: z.string().max(1000).optional(),
    scope: z.enum(['neighborhood', 'city', 'topic']),
    location: z.string().max(160).optional(),
    topic: z.string().max(80).optional(),
  }),
});
