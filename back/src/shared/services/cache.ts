class Cache {
    private cacheMap = new Map<
        string,
        { expiration: number; value: unknown }
    >();

    async setCacheItem(key: string, value: unknown, expiresIn: number) {
        this.removeOldEntries();

        const expiration = Date.now() + expiresIn;
        this.cacheMap.set(key, { expiration, value });
    }

    async getCacheItem<T>(key: string) {
        this.removeOldEntries();

        const item = this.cacheMap.get(key);

        if (!item) {
            return;
        }

        return item.value as T;
    }

    private removeOldEntries() {
        const now = Date.now();
        for (const [key, value] of this.cacheMap) {
            if (now < value.expiration) {
                break;
            }

            this.cacheMap.delete(key);
        }
    }
}

export const cache = new Cache();
