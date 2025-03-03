import { TonConnectButton } from "@tonconnect/ui-react";
import { NFTList, useNFTsInfiniteQuery } from "../../features/NFTList";
import { Loader } from "../../shared/components/Loader";
import styles from "./Home.module.scss";

export function Home() {
    const { nfts, isFetching, isError, hasNextPage, fetchNextPage } =
        useNFTsInfiniteQuery();

    const onEndReached = () => {
        if (!isFetching) {
            fetchNextPage();
        }
    };

    const renderList = () => {
        if (nfts.length === 0 && isFetching) {
            return <Loader size="big" />;
        }

        if (nfts.length === 0 && isError) {
            return <div>Error happened</div>;
        }

        return (
            <NFTList
                nfts={nfts}
                hasNextPage={hasNextPage && !isError}
                onEndReached={onEndReached}
            />
        );
    };

    return (
        <div className={styles.homePage}>
            <header className={styles.homePageHeader}>
                <h1 className={styles.homePageHeading}>List of NFTs</h1>
                <TonConnectButton />
            </header>
            {renderList()}
        </div>
    );
}
