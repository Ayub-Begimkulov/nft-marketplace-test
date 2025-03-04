import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { bot } from "./features/bot/index.js";
import { nftsRouter } from "./features/nfts/index.js";
import { cors } from "hono/cors";
import { getEnv, getPort } from "./shared/utils/index.js";

const { RENDER_EXTERNAL_URL, PORT } = getEnv();

const app = new Hono().basePath("/api/v1");

app.use("*", cors());

app.route("/nfts", nftsRouter);

app.get("/health", (ctx) => {
    return ctx.json({ success: true });
});

if (!RENDER_EXTERNAL_URL) {
    bot.launch(() => {
        console.log("Bot is running...");
    });
} else {
    bot.telegram.setWebhook(`${RENDER_EXTERNAL_URL}/api/v1/bot-webhook`);
    app.get("/bot-webhook", async (ctx) => {
        const body = await ctx.req.json();
        await bot.handleUpdate(body);
        return ctx.json({ success: true });
    });
}

serve({
    fetch: app.fetch,
    port: getPort(PORT, 3000),
});
