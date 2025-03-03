import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../../shared/services/api";

type NFTItemsResponse = {
    nfts: NFTItem[];
    hasMore: boolean;
    nextCursor?: string;
};

export type NFTItem = {
    friendlyAddress: string;
    rawAddress: string;
    ownerAddress: string;
    image: string;
    name: string;
    description?: string;
};

function fetchNFTItems(cursor?: string) {
    return api
        .get(`/nfts`, {
            searchParams: cursor
                ? {
                      cursor,
                  }
                : undefined,
        })
        .json<NFTItemsResponse>();
}

export function useNFTsInfiniteQuery() {
    const { data, isFetching, isError, hasNextPage, fetchNextPage } =
        useInfiniteQuery({
            queryKey: ["nfts"],
            queryFn: ({ pageParam: cursor }) => fetchNFTItems(cursor),
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (lastPage) => {
                return lastPage.nextCursor;
            },
        });

    const nfts = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.pages.flatMap((page) => page.nfts);
    }, [data]);

    return {
        nfts,
        isFetching,
        isError,
        hasNextPage,
        fetchNextPage,
    };
}
