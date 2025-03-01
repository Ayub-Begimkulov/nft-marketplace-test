import { isString } from "../../../shared/utils/index.js";
import { redisCache } from "../../../shared/services/redis-cache.js";
import { fetchNFTAddressesFromTable, fetchTableId } from "./notion.js";
import { fetchNFTData } from "./ton-center.js";

const cacheKeys = {
    tableId: "nfts:table-id",
    nftsData: (pageId: string, pageSize: number, cursor?: string) =>
        `nfts:${pageId}:${pageSize}:${cursor ?? "__start__"}`,
    nftsDataLock: (pageId: string, pageSize: number, cursor?: string) =>
        cacheKeys.nftsData(pageId, pageSize, cursor) + ":lock",
};
const NFT_DATA_TTL = 60 * 15;

// TODO lock?
async function fetchTableIdWithCache(pageId: string) {
    let tableId = await redisCache.get<string>(cacheKeys.tableId);

    if (isString(tableId)) {
        return tableId;
    }

    tableId = await fetchTableId(pageId);

    if (!isString(tableId)) {
        return;
    }

    // don't wait for cache to be set...
    // redisCache.set(cacheKeys.tableId, tableId);

    return tableId;
}

type NFTData = {
    nfts: any[];
    nextCursor?: string;
    hasMore: boolean;
};

export async function fetchNFTs(
    pageId: string,
    pageSize: number,
    startCursor?: string,
) {
    const tableId = await fetchTableIdWithCache(pageId);

    if (!isString(tableId)) {
        return {
            nfts: [],
            hasMore: false,
        };
    }

    const nftsDataCacheKey = cacheKeys.nftsData(pageId, pageSize, startCursor);

    let data = await redisCache.get(nftsDataCacheKey);

    if (data) {
        console.log("cache hit!!!");
        return data;
    }

    const nftsDataCacheLockKey = cacheKeys.nftsDataLock(
        pageId,
        pageSize,
        startCursor,
    );
    const randomLockValue = Math.random().toString(36);

    const lockValue = await redisCache.set(
        nftsDataCacheLockKey,
        randomLockValue,
        {
            NX: true,
            EX: 5,
        },
    );

    console.log(lockValue);

    if (lockValue) {
        const nftAddressesResponse = await fetchNFTAddressesFromTable(
            tableId,
            pageSize,
            startCursor,
        );

        const nftData = await fetchNFTData(nftAddressesResponse.nfts);

        const result = {
            nfts: nftData,
            hasMore: nftAddressesResponse.hasMore,
            nextCursor: nftAddressesResponse.nextCursor,
        };

        await redisCache.set(nftsDataCacheKey, result, { EX: NFT_DATA_TTL });

        const newLockValue = await redisCache.get(nftsDataCacheLockKey);

        // should we make this check???
        if (newLockValue === lockValue) {
            await redisCache.delete(nftsDataCacheLockKey);
        }

        redisCache.publish(nftsDataCacheLockKey, "");

        return result;
    } else {
        await redisCache.waitForEvent(
            cacheKeys.nftsDataLock(pageId, pageSize, startCursor),
        );
        return redisCache.get(nftsDataCacheKey);
    }
}
