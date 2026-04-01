import Redis from "ioredis";

declare global {
    // eslint-disable-next-line no-var
    var _redisClient: Redis | undefined;
}

const REDIS_URL = process.env.REDIS_URL!;

function getRedisClient(): Redis {
    if (global._redisClient) return global._redisClient;
    global._redisClient = new Redis(REDIS_URL);
    return global._redisClient;
}

export const redis = getRedisClient();
export default redis;
