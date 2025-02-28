import fs from "fs";
import path from "path";

const LIMIT = 100;
const NOTION_API_URL = "https://www.notion.so/api/v3";

type LoadPageChunkData = {
    cursor: {
        stack: {}[];
    };
};

async function fetchNotionPublicPage(pageId: string, limit: number) {
    const blocks: Record<string, any> = {};
    let cursor = {
        stack: [],
    };

    try {
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
                    limit,
                    verticalColumns: false,
                    cursor,
                }),
            });

            const data = await response.json();
            fs.writeFile(
                path.resolve(path.dirname(""), "./data.json"),
                JSON.stringify(data, null, 2),
                (error) => {
                    console.log(error);
                },
            );
            cursor = data.cursor;

            for (const key in data.recordMap.block) {
                blocks[key] = data.recordMap.block[key];
            }
        } while (cursor.stack.length > 0);
    } catch (error) {
        console.error("error", error);
        // TODO handle error
    }

    // fs.writeFile(
    //     path.resolve(path.dirname(""), "./data.json"),
    //     JSON.stringify(blocks, null, 2),
    //     (error) => {
    //         console.log(error);
    //     },
    // );
}

function formatNotionId(id: string) {
    if (!id || id.length !== 32) {
        throw new Error("Invalid Notion ID. It must be a 32-character string.");
    }
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(
        16,
        20,
    )}-${id.slice(20)}`;
}

fetchNotionPublicPage("1745274bd2cf80689ec0dec263902ac8", LIMIT);
