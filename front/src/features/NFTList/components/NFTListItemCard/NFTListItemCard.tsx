import { VirtualItem } from "@tanstack/react-virtual";
import { NFTItem } from "../../hooks/queries";
import { NFTAddress } from "../NFTAddress";
import styles from "./styles.module.scss";

type NFTListItemCardProps = {
    virtualItem: VirtualItem;
    item: NFTItem;
    measureElementRef: (element: Element | null) => void;
};

export function NFTListItemCard({
    virtualItem,
    item,
    measureElementRef,
}: NFTListItemCardProps) {
    return (
        <div
            key={virtualItem.key}
            className={styles.nftListItemCard}
            style={{
                transform: `translateY(${virtualItem.start}px)`,
                height: virtualItem.size,
            }}
        >
            <div
                ref={measureElementRef}
                data-index={virtualItem.index}
                className={styles.nftListItemCardContent}
            >
                {item.image && (
                    <img
                        src={item.image}
                        className={styles.nftListItemCardImage}
                    />
                )}

                <div className={styles.nftListItemCardInfo}>
                    <div className={styles.nftListItemCardName}>
                        {item.name}
                    </div>
                    <div className={styles.nftListItemCardDescription}>
                        {item.description}
                    </div>

                    <NFTAddress name="Address" address={item.friendlyAddress} />
                    <NFTAddress name="Raw Address" address={item.rawAddress} />
                    <NFTAddress
                        name="Owner Address"
                        address={item.ownerAddress}
                    />
                </div>
            </div>
        </div>
    );
}
