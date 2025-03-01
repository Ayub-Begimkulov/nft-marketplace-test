import { formatNotionId } from "./format-notion-id";

const LIMIT = 100;
const NOTION_API_URL = "https://www.notion.so/api/v3";

export async function fetchNotionPageContent(pageId: string) {
    const blocks: Record<string, any> = {};
    let cursor = {
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

        const data = await response.json();

        cursor = data.cursor;

        for (const key in data.recordMap.block) {
            blocks[key] = data.recordMap.block[key];
        }
    } while (cursor.stack.length > 0);

    return blocks;
}
