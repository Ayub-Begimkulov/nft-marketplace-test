import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNFTItems, NFTItem } from "../services/request";
import { useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

function shortAddress(address: string) {
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
}

export function Home() {
    const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
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

    return (
        <div style={{ padding: "0 24px" }}>
            <h1>List of NFTs</h1>
            <NFTList nfts={nfts} />
        </div>
    );
}

type NFTListProps = {
    nfts: NFTItem[];
};

function NFTList({ nfts }: NFTListProps) {
    const virtualizer = useWindowVirtualizer({
        count: nfts.length,
        estimateSize: () => 300,
        overscan: 1,
        getItemKey(index) {
            return nfts[index].friendlyAddress;
        },
    });

    return (
        <div>
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    position: "relative",
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                    const item = nfts[virtualItem.index];
                    console.log(virtualItem);
                    return (
                        <div
                            key={virtualItem.key}
                            ref={virtualizer.measureElement}
                            data-index={virtualItem.index}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                transform: `translateY(${virtualItem.start}px)`,
                                height: virtualItem.size,
                            }}
                        >
                            <div
                                style={{
                                    padding: "12px",
                                    borderRadius: 8,
                                    border: "1px solid lightgrey",
                                }}
                            >
                                <div style={{ width: 200, height: 200 }}>
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                </div>
                                <div>{shortAddress(item.friendlyAddress)}</div>
                                <div>{shortAddress(item.rawAddress)}</div>
                                <div>{shortAddress(item.ownerAddress)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
