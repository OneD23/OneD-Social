import { z } from 'zod';
const attachment = z.object({ type: z.enum(['image', 'video', 'file']), url: z.string().url(), media: z.string().optional() });
export const conversationSchema = z.object({ body: z.object({ type: z.enum(['private', 'group']), title: z.string().max(120).optional(), participantIds: z.array(z.string()).min(1).max(100) }) });
export const sendMessageSchema = z.object({ body: z.object({ conversationId: z.string(), text: z.string().max(4000).optional().default(''), attachments: z.array(attachment).max(10).optional().default([]), replyTo: z.string().optional() }).refine((v) => v.text || v.attachments.length, { message: 'Message requires text or attachments' }) });
