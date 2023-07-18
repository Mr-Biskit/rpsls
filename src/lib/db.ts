import { Redis } from "@upstash/redis";
import { RedisConfigFastly } from "@upstash/redis/types/platforms/fastly";

export const db = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
} as RedisConfigFastly);
