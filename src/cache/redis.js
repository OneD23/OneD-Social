import { createClient } from 'redis';

export const redisClient = process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;
export const connectRedis = async () => {
  if (redisClient && !redisClient.isOpen) await redisClient.connect();
};
