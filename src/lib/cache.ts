import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            password: process.env.REDIS_PASSWORD,
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
        });

        await redisClient.connect();
    }

    return redisClient;
}

/**
 * Cache wrapper for functions
 */
export async function withCache<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>
): Promise<T> {
    try {
        const client = await getRedisClient();

        // Try to get from cache
        const cached = await client.get(key);
        if (cached) {
            return JSON.parse(cached);
        }

        // Execute function and cache result
        const result = await fn();
        await client.setEx(key, ttl, JSON.stringify(result));

        return result;
    } catch (error) {
        console.error('Cache error:', error);
        // Fallback to executing function without cache
        return fn();
    }
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCache(pattern: string) {
    try {
        const client = await getRedisClient();
        const keys = await client.keys(pattern);

        if (keys.length > 0) {
            await client.del(keys);
        }
    } catch (error) {
        console.error('Cache invalidation error:', error);
    }
}

/**
 * Set cache value
 */
export async function setCache(key: string, value: any, ttl: number = 3600) {
    try {
        const client = await getRedisClient();
        await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error('Set cache error:', error);
    }
}

/**
 * Get cache value
 */
export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const client = await getRedisClient();
        const cached = await client.get(key);

        if (cached) {
            return JSON.parse(cached);
        }

        return null;
    } catch (error) {
        console.error('Get cache error:', error);
        return null;
    }
}

/**
 * Delete cache value
 */
export async function deleteCache(key: string) {
    try {
        const client = await getRedisClient();
        await client.del(key);
    } catch (error) {
        console.error('Delete cache error:', error);
    }
}

/**
 * Increment counter in cache
 */
export async function incrementCache(key: string, ttl: number = 3600): Promise<number> {
    try {
        const client = await getRedisClient();
        const value = await client.incr(key);
        await client.expire(key, ttl);
        return value;
    } catch (error) {
        console.error('Increment cache error:', error);
        return 0;
    }
}
