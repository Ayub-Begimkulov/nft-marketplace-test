import { NotionAPI } from "notion-client";
import { cache } from "../../../shared/services/cache";
// import { fetchNotionPageContent } from "./fetch-notion-page-content";

const pageId = "1745274bd2cf80689ec0dec263902ac8";
const cacheKey = "nfts";

const notionClient = new NotionAPI();
export async function fetchNFTs() {
    const cachedNFTs = await cache.getCacheItem<string[]>(cacheKey);

    if (cachedNFTs) {
        return cachedNFTs;
    }

    // const blocks = await fetchNotionPageContent(pageId);
}

// function extractNFTs(blocks: Record<string, any>) {
//     let tableBlock;
//     for (const key in blocks) {
//         const block = blocks[key];

//         if (block.value.type === "table") {
//             tableBlock = block;
//             break;
//         }
//     }

//     if (!tableBlock) {
//         return [];
//     }

//     const tableItems = [];

//     tableBlock.value.content.forEach((item: any) => {});
// }
