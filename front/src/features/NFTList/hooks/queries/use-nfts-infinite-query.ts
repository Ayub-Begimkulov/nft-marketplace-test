import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNFTItems } from "../../../../services/request";
import { useMemo } from "react";

// TODO remove after testing...
function sleep(ms: number) {
    return new Promise<void>((res) => {
        setTimeout(res, ms);
    });
}

export function useNFTsInfiniteQuery() {
    const { data, isFetching, isError, hasNextPage, fetchNextPage } =
        useInfiniteQuery({
            queryKey: ["nfts"],
            queryFn: ({ pageParam: cursor }) =>
                Promise.all([fetchNFTItems(cursor), sleep(2000)] as const).then(
                    ([res]) => res,
                ),
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
