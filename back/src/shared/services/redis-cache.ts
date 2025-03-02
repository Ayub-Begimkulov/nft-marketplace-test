import { Redis } from "ioredis";
import { getEnv, isNumber, logger } from "../utils/index.js";
import { JSONSerializable } from "../types/index.js";

type RedisSetOption = {
    NX?: boolean;
    EX?: number;
};

class RedisCache {
    private redis: Redis;

    constructor(url: string) {
        this.redis = new Redis(url);
    }

    async get<T>(key: string) {
        try {
            const data = await this.redis.get(key);

            if (data === null) {
                return;
            }

            return JSON.parse(data) as T;
        } catch (error) {
            logger.error("[RedisCache.get]", error);
            return;
        }
    }

    async set(key: string, value: JSONSerializable, options?: RedisSetOption) {
        try {
            const string = JSON.stringify(value);

            // `set`'s overload logic won't work
            // well with our abstraction, just cast
            // optionsList to empty array
            const optionsList = options
                ? (buildOptions(options) as [])
                : ([] as []);

            const result = await this.redis.set(key, string, ...optionsList);

            if (result === null) {
                return;
            }

            return result;
        } catch (error) {
            logger.error("[RedisCache.set]", error);
            return;
        }
    }

    async delete(key: string) {
        try {
            await this.redis.del(key);
        } catch (error) {
            logger.error("[RedisCache.delete]", error);
            return;
        }
    }
}

function buildOptions(option: RedisSetOption) {
    const arr = [];

    if (option.NX) {
        arr.push("NX");
    }
    if (isNumber(option.EX)) {
        arr.push("EX", option.EX);
    }
    return arr;
}

export const redisCache = new RedisCache(getEnv().REDIS_URL);
