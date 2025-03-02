import { Hono } from "hono";
import { fetchNFTs } from "./services/nfts.js";
import { getEnv } from "../../shared/utils/get-env.js";

export const nftsRouter = new Hono();

const PAGE_ID = getEnv().NOTION_PAGE_ID;
// the task specifies that we only need to load
// 5 items per each request. Therefor I don't allow
// customizing page size for better caching...
const PAGE_SIZE = 5;

nftsRouter.get("/", async (ctx) => {
    const { cursor } = ctx.req.query();

    const nfts = await fetchNFTs(PAGE_ID, PAGE_SIZE, cursor);

    return ctx.json(nfts);
});
