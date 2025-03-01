import { Client, isNotionClientError, APIErrorCode } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { Address } from "@ton/core";
import {
    isString,
    logger,
    getEnv,
    isEnum,
    createHTTPException,
} from "../../../shared/utils/index.js";

const notionClient = new Client({ auth: getEnv().NOTION_API_KEY });

// it's maximum allowed by Notion's API
const BLOCKS_PAGE_SIZE = 100;

export async function fetchTableId(pageId: string) {
    try {
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
    } catch (error) {
        logger.error("[fetchTableId]", error);

        throw createException(error);
    }
}

export async function fetchNFTAddressesFromTable(
    tableId: string,
    pageSize: number,
    startCursor?: string,
) {
    try {
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

            if (
                !isString(firstCellValue) ||
                !Address.isFriendly(firstCellValue)
            ) {
                return;
            }

            nfts.push(firstCellValue);
        });

        return {
            nfts,
            hasMore: tableItems.has_more,
            nextCursor: tableItems.next_cursor,
        };
    } catch (error) {
        logger.error("[fetchNFTAddressesFromTable]", error);

        throw createException(error);
    }
}

function createException(error: unknown) {
    const status =
        isNotionClientError(error) && isEnum(APIErrorCode, error.code)
            ? 400
            : 500;

    const message = isNotionClientError(error)
        ? error.message
        : "Internal server error";

    return createHTTPException({ status, message });
}
