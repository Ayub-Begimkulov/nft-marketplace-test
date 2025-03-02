import { AppHTTPException, logger } from "../../../shared/utils/index.js";

const TON_CENTER_API = `https://toncenter.com/api/v3`;

type TonCenterNftResponse = {
    nft_items: TonCenterNftItem[];
    address_book: Record<string, TonCenterAddressBookEntry>;
    metadata: Record<string, TonCenterMetadataEntry>;
};

type TonCenterNftItem = {
    address: string;
    collection_address: string;
    owner_address: string;
};

type TonCenterAddressBookEntry = {
    user_friendly: string;
    domain: string | null;
};

type TonCenterMetadataEntry = {
    is_indexed: boolean;
    token_info?: TonCenterTokenInfo[];
};

type TonCenterTokenInfo = {
    type: "nft_items" | "nft_collections";
    name?: string;
    description?: string;
    image?: string;
    extra?: TonCenterTokenExtra;
};

type TonCenterTokenExtra = {
    _image_big?: string;
    _image_medium?: string;
    _image_small?: string;
    cover_image?: string;
};

async function fetchNFTDataFromTonCenter(addresses: string[]) {
    const query = new URLSearchParams();

    addresses.forEach((address) => {
        query.append("address", address);
    });

    const response = await fetch(
        `${TON_CENTER_API}/nft/items?${query.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    if (!response.ok) {
        const text = await response.text();

        throw new AppHTTPException({
            status: response.status,
            message: "Failed to fetch nft data",
            details: text,
        });
    }

    const data = await response.json();

    return data as TonCenterNftResponse;
}

export type NFTItemData = {
    friendlyAddress: string;
    rawAddress: string;
    ownerAddress: string;
    image?: string;
    name?: string;
    description?: string;
};

export async function fetchNFTData(addresses: string[]) {
    try {
        const data = await fetchNFTDataFromTonCenter(addresses);

        const friendlyToDataMap = new Map<string, NFTItemData>();

        data.nft_items.forEach((item) => {
            const friendly = data.address_book?.[item.address]?.user_friendly;

            // api always returns a correct address book for each
            // item. this check is mostly for TS
            if (!friendly) {
                return;
            }

            const meta = data.metadata?.[item.address]?.token_info?.[0];
            const collectionMeta =
                data.metadata[item.collection_address]?.token_info?.[0];

            friendlyToDataMap.set(friendly, {
                friendlyAddress: friendly,
                rawAddress: item.address,
                ownerAddress: item.owner_address,
                image:
                    meta?.extra?._image_medium ??
                    collectionMeta?.extra?._image_medium,
                name: meta?.name ?? collectionMeta?.name,
                description: meta?.description ?? collectionMeta?.description,
            });
        });

        const nftItems: NFTItemData[] = [];

        addresses.forEach((address) => {
            const data = friendlyToDataMap.get(address);

            if (!data) {
                return;
            }

            nftItems.push(data);
        });

        return nftItems;
    } catch (error) {
        logger.error("[fetchNFTData]", error);

        if (error instanceof AppHTTPException) {
            return Promise.reject(error);
        }

        return Promise.reject(
            new AppHTTPException({
                status: 500,
                message: "Internal Server Error",
                details: error instanceof Error ? error.message : undefined,
            }),
        );
    }
}
