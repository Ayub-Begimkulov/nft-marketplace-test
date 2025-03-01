import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { fetchNFTAddresses } from "./utils/fetch-nft-addresses.js";

export const nftsRouter = new Hono();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

// didn't use a validator here, since we only have
// 2 query params, and it's the only endpoint
// we have in our app
nftsRouter.get("/", async (ctx) => {
    const { page: pageQuery, limit: limitQuery } = ctx.req.query();

    const page = pageQuery ? parseInt(pageQuery, 10) : DEFAULT_PAGE;

    if (Number.isNaN(page)) {
        throw new HTTPException(400, {
            message: "invalid `page` provided",
        });
    }

    const limit = limitQuery ? parseInt(limitQuery, 10) : DEFAULT_LIMIT;

    if (Number.isNaN(limit)) {
        throw new HTTPException(400, {
            message: "invalid `limit` provided",
        });
    }

    const nfts = await fetchNFTAddresses();

    const nftsStart = (page - 1) * limit;
    const nftsEnd = page * limit;
    const nftsForPage = nfts.slice(nftsStart, nftsEnd);

    if (nftsForPage.length === 0) {
        return ctx.json({
            nfts: [],
            hasMore: false,
        });
    }

    return ctx.json({
        nfts: nftsForPage,
        hasMore: nftsEnd < nfts.length,
    });
});
