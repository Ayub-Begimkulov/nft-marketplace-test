import { Redis, RedisKey } from "ioredis";
import { getEnv } from "../utils/get-env.js";
import { logger } from "../utils/logger.js";
import { JSONSerializable } from "../types/index.js";

const DEFAULT_WAIT_EVENT_TIMEOUT = 5_000;

class RedisCache {
    private redis: Redis;
    private subRedis: Redis;

    constructor(url: string) {
        this.redis = new Redis(url);
        this.subRedis = new Redis(url);
    }

    async get<T>(key: RedisKey) {
        try {
            const data = await this.redis.get(key);

            if (data === null) {
                return null;
            }

            return JSON.parse(data) as T;
        } catch (error) {
            logger.error("[RedisCache.get]", error);
            return null;
        }
    }

    async set(key: RedisKey, value: JSONSerializable) {
        try {
            const string = JSON.stringify(value);
            await this.redis.set(key, string);
        } catch (error) {
            logger.error("[RedisCache.set]", error);
        }
    }

    async publish(channel: RedisKey, message: JSONSerializable) {
        try {
            const string = JSON.stringify(message);
            await this.redis.publish(channel, string);
        } catch (error) {
            logger.error("[RedisCache.publish]", error);
        }
    }

    waitForEvent(channel: RedisKey, timeout = DEFAULT_WAIT_EVENT_TIMEOUT) {
        return new Promise<void>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error("Exceeded timeout while waiting for event"));

                this.subRedis.unsubscribe(channel);
            }, timeout);

            this.subRedis.subscribe(channel, (error, value) => {
                clearTimeout(timeoutId);

                if (error) {
                    return reject(error);
                }

                resolve();

                this.subRedis.unsubscribe(channel);
            });
        });
    }
}

export const redisCache = new RedisCache(getEnv().REDIS_URL);
