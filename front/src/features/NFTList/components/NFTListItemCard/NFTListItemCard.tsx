import { VirtualItem } from "@tanstack/react-virtual";
import { NFTItem } from "../../../../services/request";
import { shortAddress } from "../../utils";
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
                    <div>{item.name}</div>
                    <div>{item.description}</div>
                    <div>{shortAddress(item.friendlyAddress)}</div>
                    <div>{shortAddress(item.rawAddress)}</div>
                    <div>{shortAddress(item.ownerAddress)}</div>
                </div>
            </div>
        </div>
    );
}
