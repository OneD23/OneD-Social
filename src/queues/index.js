import { Queue } from 'bullmq';

const connection = process.env.REDIS_URL ? { connection: { url: process.env.REDIS_URL } } : null;

export const mediaCleanupQueue = connection ? new Queue('media-cleanup', connection) : null;
export const notificationsQueue = connection ? new Queue('notifications', connection) : null;
