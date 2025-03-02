import ky from "ky";

const REQEST_TIMEOUT = 30_000;

type NFTItemsResponse = {
    nfts: NFTItem[];
    hasMore: boolean;
    nextCursor?: string;
};

export type NFTItem = {
    friendlyAddress: string;
    rawAddress: string;
    ownerAddress: string;
    image?: string;
    name?: string;
    description?: string;
};

export function fetchNFTItems(cursor?: string) {
    return ky
        .get(`${import.meta.env.VITE_API_URL}/nfts`, {
            searchParams: cursor
                ? {
                      cursor,
                  }
                : undefined,
            timeout: REQEST_TIMEOUT,
        })
        .json<NFTItemsResponse>();
}
