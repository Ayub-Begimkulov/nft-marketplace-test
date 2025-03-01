import { BlockMap, PageChunk } from "notion-types";
import { formatNotionId } from "./format-notion-id.js";

const LIMIT = 100;
const NOTION_API_URL = "https://www.notion.so/api/v3";

export async function fetchNotionPageContent(pageId: string) {
    const blocks: BlockMap = {};
    let cursor: PageChunk["cursor"] = {
        stack: [],
    };

    // handle pagination inside of the loop
    // in case if the page content becomes bigger
    // so far the limit covers our needs and we make
    // only 1 request
    do {
        const response = await fetch(`${NOTION_API_URL}/loadPageChunk`, {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pageId: formatNotionId(pageId),
                limit: LIMIT,
                verticalColumns: false,
                cursor,
            }),
        });

        const data = (await response.json()) as PageChunk;

        cursor = data.cursor;

        for (const key in data.recordMap.block) {
            const block = data.recordMap.block[key]!;

            blocks[key] = block;
        }
    } while (cursor.stack.length > 0);

    return blocks;
}
