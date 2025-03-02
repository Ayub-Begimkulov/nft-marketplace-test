import { useNFTsInfiniteQuery } from "../features/NFTList/hooks/queries";
import { NFTList } from "../features/NFTList/NFTList";

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
            return <div>Loader...</div>;
        }

        if (isError) {
            return <div>Error happened</div>;
        }

        return (
            <NFTList
                nfts={nfts}
                hasNextPage={hasNextPage}
                onEndReached={onEndReached}
            />
        );
    };

    return (
        <div style={{ padding: "0 24px", maxWidth: 500, margin: "0 auto" }}>
            <h1>List of NFTs</h1>
            {renderList()}
        </div>
    );
}
