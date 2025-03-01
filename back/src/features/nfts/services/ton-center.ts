import { createHTTPException, logger } from "../../../shared/utils/index.js";

// TODO typings + check other solutions
const TON_CENTER_API = `https://toncenter.com/api/v3`;

export async function fetchNFTData(addresses: string[]) {
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

        logger.error("[fetchNFTData]", text);

        throw createHTTPException({
            status: response.status,
            message: "Failed to fetch nft data",
            data: text,
        });
    }

    const data = await response.json();

    const friendlyToDataMap = new Map();
    data.nft_items.forEach((item: any) => {
        const friendly = data.address_book[item.address].user_friendly;
        const meta = data.metadata[item.address].token_info[0] ?? {};

        friendlyToDataMap.set(friendly, {
            friendlyAddress: friendly,
            rawAddress: item.address,
            ownerAddress: item.ownerAddress,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        });
    });

    return addresses.map((item) => friendlyToDataMap.get(item)).filter(Boolean);
}
