import { z } from 'zod';

export const businessSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    logoUrl: z.string().url().or(z.literal('')).optional(),
    category: z.string().min(2).max(80),
    description: z.string().max(1000).optional(),
    location: z.string().min(2).max(160),
    phone: z.string().max(30).optional(),
    whatsapp: z.string().max(30).optional(),
  }),
});
