import { VirtualItem } from "@tanstack/react-virtual";
import styles from "./styles.module.scss";
import { Loader } from "../../../../shared/components/Loader";

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
