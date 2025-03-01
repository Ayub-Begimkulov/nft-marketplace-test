import { Redis } from "ioredis";

const DEFAULT_WAIT_EVENT_TIMEOUT = 5_000;

class RedisCache {
    private redis: Redis;
    private subRedis: Redis;

    constructor(url: string) {
        this.redis = new Redis(url);
        this.subRedis = new Redis(url);
    }

    set(key: string, value: string | Buffer | number) {
        return this.redis.set(key, value);
    }

    publish(channel: string | Buffer, message: string | Buffer) {
        return this.redis.publish(channel, message);
    }

    waitForEvent(
        channel: string | Buffer,
        timeout = DEFAULT_WAIT_EVENT_TIMEOUT,
    ) {
        return new Promise<void>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error("Exceeded timeout while waiting for event"));

                this.subRedis.unsubscribe(channel);
            }, timeout);

            this.subRedis.subscribe(channel, (error) => {
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

export const redisCache = new RedisCache("redis://localhost:6379");
