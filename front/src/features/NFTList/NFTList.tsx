import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { NFTItem } from "../../services/request";
import { useIntersectionObserver } from "../../shared/hooks";
import { shortAddress } from "./utils";

type NFTListProps = {
    nfts: NFTItem[];
    hasNextPage: boolean;
    onEndReached: () => void;
};

export function NFTList({ nfts, hasNextPage, onEndReached }: NFTListProps) {
    const virtualizer = useWindowVirtualizer({
        count: nfts.length + (hasNextPage ? 1 : 0),
        overscan: 2,
        estimateSize: (index) => {
            if (index < nfts.length) {
                return 300;
            }

            // last item is loader
            return 50;
        },
        getItemKey(index) {
            if (index < nfts.length) {
                return nfts[index].friendlyAddress;
            }

            return "__loader__";
        },
    });

    const lastItemRef = useIntersectionObserver((entry) => {
        if (entry.isIntersecting) {
            onEndReached();
        }
    });

    return (
        <div
            style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
                maxWidth: 500,
            }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => {
                if (virtualItem.index > nfts.length - 1) {
                    return (
                        <div
                            ref={lastItemRef}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: virtualItem.size,
                                transform: `translateY(${virtualItem.start}px)`,
                                width: "100%",
                            }}
                            key={virtualItem.key}
                        >
                            Loading...
                        </div>
                    );
                }

                const item = nfts[virtualItem.index];

                return (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transform: `translateY(${virtualItem.start}px)`,
                            height: virtualItem.size,
                            width: "100%",
                        }}
                    >
                        <div
                            ref={virtualizer.measureElement}
                            data-index={virtualItem.index}
                            style={{ paddingBottom: 16 }}
                        >
                            <div
                                style={{
                                    borderRadius: 8,
                                    border: "1px solid lightgrey",
                                    overflow: "hidden",
                                }}
                            >
                                {item.image && (
                                    <img
                                        src={item.image}
                                        style={{
                                            width: "100%",
                                            objectFit: "cover",
                                            aspectRatio: 1,
                                        }}
                                    />
                                )}

                                <div style={{ padding: "8px 12px" }}>
                                    <div>{item.name}</div>
                                    <div>{item.description}</div>
                                    <div>
                                        {shortAddress(item.friendlyAddress)}
                                    </div>
                                    <div>{shortAddress(item.rawAddress)}</div>
                                    <div>{shortAddress(item.ownerAddress)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
