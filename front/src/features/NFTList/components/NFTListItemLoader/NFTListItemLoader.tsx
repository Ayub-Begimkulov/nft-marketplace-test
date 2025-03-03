import { VirtualItem } from "@tanstack/react-virtual";
import { Loader } from "../../../../shared/components/Loader";
import styles from "./NFTListItemLoader.module.scss";

type NFTListItemLoaderProps = {
    virtualItem: VirtualItem;
    itemRef: React.Ref<HTMLDivElement>;
};

export function NFTListItemLoader({
    virtualItem,
    itemRef,
}: NFTListItemLoaderProps) {
    return (
        <div
            ref={itemRef}
            className={styles.nftListItemLoader}
            style={{
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
            }}
        >
            <Loader />
        </div>
    );
}
