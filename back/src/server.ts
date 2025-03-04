import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { handle } from "hono/vercel";
import { bot } from "./features/bot/index.js";
import { nftsRouter } from "./features/nfts/index.js";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");

app.use("*", cors());

app.route("/nfts", nftsRouter);

app.get("/health", (ctx) => {
    console.log("====request=====");
    return ctx.json({ success: true });
});

if (!process.env.VERCEL) {
    bot.launch(() => {
        console.log("Bot is running...");
    });
} else {
    app.get("/bot-webhook", async (ctx) => {
        const body = await ctx.req.json();
        await bot.handleUpdate(body);
        return ctx.json({ success: true });
    });
}

if (!process.env.VERCEL) {
    console.log("====running---server=====");
    serve({
        fetch: app.fetch,
        port: 3000,
    });
}

export default handle(app);
