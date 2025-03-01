import { Hono } from "hono";
import { fetchNFTs } from "./utils/fetch-table-id.js";
import { getEnv } from "../../shared/utils/get-env.js";

export const nftsRouter = new Hono();

const PAGE_ID = getEnv().NOTION_PAGE_ID;
const PAGE_SIZE = 5;

nftsRouter.get("/", async (ctx) => {
    const { cursor } = ctx.req.query();

    const nfts = await fetchNFTs(PAGE_ID, PAGE_SIZE, cursor);

    return ctx.json(nfts);
});
