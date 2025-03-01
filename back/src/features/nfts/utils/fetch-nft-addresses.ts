import { Block, BlockMap } from "notion-types";
import { Address } from "@ton/core";
import { cache } from "../../../shared/services/cache.js";
import { fetchNotionPageContent } from "./fetch-notion-page-content.js";
import fs from "fs";
import path from "path";

const pageId = "1745274bd2cf80689ec0dec263902ac8";
const cacheKey = "nfts";
const cacheTTL = 1000 * 60 * 15;
const nftColumn = "Iqwq";

export async function fetchNFTAddresses() {
    const cachedNFTs = await cache.getCacheItem<string[]>(cacheKey);

    if (cachedNFTs) {
        return cachedNFTs;
    }

    const blocksData = await fs.promises.readFile(
        path.resolve(path.dirname(""), "./data2.json"),
        "utf-8",
    );
    const blocks = JSON.parse(blocksData) as BlockMap;
    // const blocks = await fetchNotionPageContent(pageId);

    const nfts = extractNFTs(blocks);

    cache.setCacheItem(cacheKey, nfts, cacheTTL);

    return nfts;
}

function extractNFTs(blocks: BlockMap) {
    let tableBlock: Block | undefined = undefined;

    for (const key in blocks) {
        const block = blocks[key]!;

        if (block.value.type === "table") {
            tableBlock = block.value;
            break;
        }
    }

    if (!tableBlock || !tableBlock.content) {
        return [];
    }

    const tableItems: string[] = [];

    tableBlock.content.forEach((id) => {
        const contentBlock = blocks[id];

        if (!contentBlock) {
            return;
        }

        const props = contentBlock.value.properties;

        if (
            nftColumn in props &&
            Array.isArray(props[nftColumn]) &&
            Array.isArray(props[nftColumn][0]) &&
            typeof props[nftColumn][0][0] === "string" &&
            Address.isFriendly(props[nftColumn][0][0])
        ) {
            tableItems.push(props[nftColumn][0][0]);
        }
    });

    return tableItems;
}
