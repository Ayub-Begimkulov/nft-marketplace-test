import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const nftsRouter = new Hono();

// /nfts?page=2
nftsRouter.get("/", (ctx) => {
    const pageQuery = ctx.req.query("page");
    const page = pageQuery ? parseInt(pageQuery, 10) : 1;

    if (Number.isNaN(page)) {
        throw new HTTPException(400, {
            message: "invalid `page` provided",
        });
    }

    return ctx.json({ foo: "bar" });
});
