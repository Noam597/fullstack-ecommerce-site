// redisClient.ts
// server/redis.ts
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Reuse across hot reloads (nodemon)
const g = globalThis as any;
g.__redisClient__ = g.__redisClient__ || createClient({ url: redisUrl });
export const redisClient = g.__redisClient__ as ReturnType<typeof createClient>;

let connecting: Promise<void> | null = null;

export async function connectRedisOnce(): Promise<void> {
  if (redisClient.isOpen) return;
  if (connecting) return connecting;
  connecting = (async () => {
    await redisClient.connect();
  })();
  try {
    await connecting;
  } finally {
    connecting = null;
  }
}


