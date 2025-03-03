import { isString } from "../../../shared/utils/index.js";
import { redisCache } from "../../../shared/services/redis-cache.js";
import { fetchNFTAddressesFromTable, fetchTableId } from "./notion.js";
import { fetchNFTData, NFTItemData } from "./ton-api.js";

const cacheKeys = {
    tableId: (pageId: string) => `nfts:table-id:${pageId}`,
    nftsData: (pageId: string, pageSize: number, cursor?: string) =>
        `nfts:${pageId}:${pageSize}:${cursor ?? "__start__"}`,
};

// I'm caching table id for 1h, since it
// shouldn't change at all unless someone deletes
// it from the page.
const TABLE_ID_TTL = 60 * 60;
const NFT_DATA_TTL = 60 * 15;

async function fetchTableIdWithCache(pageId: string) {
    let tableId = await redisCache.get<string>(cacheKeys.tableId(pageId));

    if (isString(tableId)) {
        return tableId;
    }

    tableId = await fetchTableId(pageId);

    if (!isString(tableId)) {
        return;
    }

    // don't wait for cache to be set...
    redisCache.set(cacheKeys.tableId(pageId), tableId, { EX: TABLE_ID_TTL });

    return tableId;
}

type NFTDataPaginated = {
    nfts: NFTItemData[];
    hasMore: boolean;
    nextCursor?: string;
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

    let data = await redisCache.get<NFTDataPaginated>(nftsDataCacheKey);

    if (data) {
        return data;
    }

    const nftAddressesResponse = await fetchNFTAddressesFromTable(
        tableId,
        pageSize,
        startCursor,
    );

    const nftData = await fetchNFTData(nftAddressesResponse.nfts);

    const result: NFTDataPaginated = {
        nfts: nftData,
        hasMore: nftAddressesResponse.hasMore,
        nextCursor: nftAddressesResponse.nextCursor ?? undefined,
    };

    // do not wait for cache to be set...
    redisCache.set(nftsDataCacheKey, result, { EX: NFT_DATA_TTL });

    return result;
}
