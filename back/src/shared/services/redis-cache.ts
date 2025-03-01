import { Redis } from "ioredis";
import { getEnv, isNumber, logger } from "../utils/index.js";
import { JSONSerializable } from "../types/index.js";

const DEFAULT_WAIT_EVENT_TIMEOUT = 5_000;

type RedisSetOption = {
    NX?: boolean;
    EX?: number;
};

class RedisCache {
    private redis: Redis;
    private subRedis: Redis;

    constructor(url: string) {
        this.redis = new Redis(url);
        this.subRedis = new Redis(url);
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

            const result = await this.redis.set(
                key,
                string,
                ...optionsList,
                "GET",
            );

            console.log("set result", result, optionsList);

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

    async publish(channel: string, message: JSONSerializable) {
        try {
            const string = JSON.stringify(message);
            await this.redis.publish(channel, string);
        } catch (error) {
            logger.error("[RedisCache.publish]", error);
        }
    }

    async waitForEvent(channel: string, timeout = DEFAULT_WAIT_EVENT_TIMEOUT) {
        try {
            await this.subRedis.subscribe(channel);

            const result = await new Promise<string>((resolve, reject) => {
                const handleMessage = (mChannel: string, message: string) => {
                    if (channel === mChannel) {
                        resolve(message);
                    }
                    clearTimeout(timeoutId);
                };

                this.subRedis.on("message", handleMessage);

                // timeout so we don't wait for event indefinitely
                const timeoutId = setTimeout(() => {
                    reject(
                        new Error("Exceeded timeout while waiting for event"),
                    );

                    this.subRedis.off("message", handleMessage);
                }, timeout);
            });

            return JSON.parse(result);
        } catch (error) {
            logger.error("[RedisCache.waitForEvent]", error);
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
