import ky from "ky";
import { AppHTTPException, logger } from "../../../shared/utils/index.js";
import { friendlyAddressToRaw } from "../utils/friendly-address-to-raw.js";

const TON_API_URL = "https://tonapi.io/v2";
const TIMEOUT = 25_000;

type TonApiNFTResponse = {
    nft_items: TonApiNFTItem[];
};

type TonApiNFTItem = {
    address: string;
    index: number;
    owner: TonApiOwner;
    collection: TonApiCollection;
    verified: boolean;
    metadata: TonApiMetadata;
    previews: TonApiPreview[];
    approved_by: string[];
    trust: "none" | "whitelist";
};

type TonApiOwner = {
    address: string;
    name?: string;
    is_scam: boolean;
    is_wallet: boolean;
};

type TonApiCollection = {
    address: string;
    name: string;
    description: string;
};

type TonApiMetadata = {
    name: string;
    description?: string;
    image: string;
    marketplace?: string;
    attributes?: TonApiAttribute[];
};

type TonApiAttribute = {
    trait_type: string;
    value: string;
    discount?: number;
    ref?: number;
    weight?: number;
};

type TonApiPreview = {
    resolution: string;
    url: string;
};

async function fetchNFTDataFromTonAPI(rawAddress: string[]) {
    const response = await ky.post<TonApiNFTResponse>(
        `${TON_API_URL}/nfts/_bulk`,
        {
            method: "post",
            json: {
                account_ids: rawAddress,
            },
            timeout: TIMEOUT,
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

    return data;
}

export type NFTItemData = {
    friendlyAddress: string;
    rawAddress: string;
    ownerAddress: string;
    image?: string;
    name: string;
    description?: string;
};

export async function fetchNFTData(addresses: string[]) {
    try {
        const rawToFriendlyMap = new Map<string, string>();
        const rawAddresses: string[] = Array(addresses.length);

        addresses.forEach((address, index) => {
            const raw = friendlyAddressToRaw(address);
            rawAddresses[index] = raw;
            rawToFriendlyMap.set(raw, address);
        });

        const data = await fetchNFTDataFromTonAPI(addresses);

        // we need this map (and `rawToFriendlyMap` too) since api
        // doesn't return nfts in the same order we fetched
        const friendlyToDataMap = new Map<string, NFTItemData>();

        data.nft_items.forEach((item) => {
            const friendly = rawToFriendlyMap.get(item.address);

            // api always returns a correct address book for each
            // item. this check is mostly for TS
            if (!friendly) {
                return;
            }
            const image =
                item.previews.find((item) => item.resolution === "1500x1500") ??
                item.previews[item.previews.length - 1];

            friendlyToDataMap.set(friendly, {
                friendlyAddress: friendly,
                rawAddress: item.address,
                ownerAddress: item.owner.address,
                image: image?.url,
                name: item.metadata.name,
                description: item.metadata.description,
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
