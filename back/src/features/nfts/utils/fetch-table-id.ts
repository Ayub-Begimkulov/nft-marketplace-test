import { Client } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { Address } from "@ton/core";
import fs from "fs";
import path from "path";
import { isString, getEnv } from "../../../shared/utils/index.js";
import { redisCache } from "../../../shared/services/redis.js";

const notionClient = new Client({ auth: getEnv().NOTION_API_KEY });

const BLOCKS_PAGE_SIZE = 100;

async function fetchTableId(pageId: string) {
    let blocksResponse: ListBlockChildrenResponse | undefined = undefined;

    // by default notion can only fetch maximum
    // of `100` elements (i.e. BLOCKS_PAGE_SIZE)
    // if we don't find table in the first 100 blocks
    // we move check on the second page
    do {
        blocksResponse = await notionClient.blocks.children.list({
            block_id: pageId,
            page_size: BLOCKS_PAGE_SIZE,
            start_cursor: blocksResponse?.next_cursor ?? undefined,
        });

        for (const block of blocksResponse.results) {
            if ("type" in block && block.type === "table") {
                return block.id;
            }
        }
    } while (blocksResponse?.has_more);

    return;
}

async function fetchNFTAddresses(
    tableId: string,
    pageSize: number,
    startCursor?: string,
) {
    const tableItems = await notionClient.blocks.children.list({
        block_id: tableId,
        // first row of the table is header
        page_size: startCursor ? pageSize : pageSize + 1,
        start_cursor: startCursor,
    });

    const nfts: string[] = [];

    tableItems.results.forEach((item) => {
        if (!("type" in item) || item.type !== "table_row") {
            return;
        }

        const firstCellValue = item.table_row.cells[0]?.[0]?.plain_text;

        if (!isString(firstCellValue) || !Address.isFriendly(firstCellValue)) {
            return;
        }

        nfts.push(firstCellValue);
    });

    return {
        nfts,
        hasMore: tableItems.has_more,
        nextCursor: tableItems.next_cursor,
    };
}

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

export async function fetchNFTs(
    pageId: string,
    pageSize: number,
    startCursor?: string,
) {
    // let tableId =
    const tableId = await fetchTableId(pageId);

    if (!tableId) {
        return {
            nfts: [],
            hasMore: false,
        };
    }

    const nftAddressesResponse = await fetchNFTAddresses(
        tableId,
        pageSize,
        startCursor,
    );

    const nftData = await fetchNFTData(nftAddressesResponse.nfts);

    const result = {
        nfts: nftData,
        hasMore: nftAddressesResponse.hasMore,
        nextCursor: nftAddressesResponse.nextCursor,
    };

    return result;
}
