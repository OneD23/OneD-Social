import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    avatarUrl: z.string().url().or(z.literal('')).optional(),
    bio: z.string().max(280).optional(),
    location: z.string().max(120).optional(),
  }),
});
