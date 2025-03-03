import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { NFTItem } from "./hooks/queries";
import { useIntersectionObserver } from "../../shared/hooks";
import { NFTListItemLoader } from "./components/NFTListItemLoader";
import { NFTListItemCard } from "./components/NFTListItemCard";

type NFTListProps = {
    nfts: NFTItem[];
    hasNextPage: boolean;
    onEndReached: () => void;
};

export function NFTList({ nfts, hasNextPage, onEndReached }: NFTListProps) {
    const virtualizer = useWindowVirtualizer({
        count: nfts.length + (hasNextPage ? 1 : 0),
        overscan: 2,
        gap: 16,
        estimateSize: (index) => {
            if (index < nfts.length) {
                return 500;
            }

            // last item is loader
            return 60;
        },
        getItemKey(index) {
            if (index < nfts.length) {
                return nfts[index].friendlyAddress;
            }

            return "__loader__";
        },
    });

    const loaderRef = useIntersectionObserver((entry) => {
        if (entry.isIntersecting) {
            onEndReached();
        }
    });

    return (
        <div
            style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
            }}
        >
            {virtualizer.getVirtualItems().map((virtualItem) => {
                if (virtualItem.index < nfts.length) {
                    const item = nfts[virtualItem.index];

                    return (
                        <NFTListItemCard
                            key={virtualItem.key}
                            virtualItem={virtualItem}
                            item={item}
                            measureElementRef={virtualizer.measureElement}
                        />
                    );
                }

                return (
                    <NFTListItemLoader
                        key={virtualItem.key}
                        virtualItem={virtualItem}
                        itemRef={loaderRef}
                    />
                );
            })}
        </div>
    );
}
