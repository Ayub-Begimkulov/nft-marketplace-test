import { promises } from "fs";
import path from "path";

const test = `nfts:_`;

// const PAGE_ID = "1a917fc953af80bba8a9d91a4e233c79";
const PAGE_ID = "1a917fc9-53af-81ff-887a-f3abf0da7e27";

const NOTION_API_KEY = "ntn_b643886788743ynhz25AnY89nqo5jqJXzYQa0ECc4Ce05R";

async function getPageBlocks() {
    const response = await fetch(
        `https://api.notion.com/v1/blocks/${PAGE_ID}/children?page_size=5`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
            },
        },
    );

    const data = await response.json();
    console.log(data);
    promises.writeFile(
        path.resolve(path.dirname(""), "./public-table-test-small.json"),
        JSON.stringify(data, null, 4),
    );
}

getPageBlocks();
