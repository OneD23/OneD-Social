import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9_\.]+$/).transform((value) => value.toLowerCase()),
    email: z.string().email().transform((value) => value.toLowerCase()),
    password: z.string().min(8).max(128),
    location: z.string().max(120).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().transform((value) => value.toLowerCase()),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string().min(20) }),
});
