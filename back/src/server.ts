import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { bot } from "./features/bot";
import { nftsRouter } from "./features/nfts";

bot.launch(() => {
    console.log("Bot is running...");
});

const app = new Hono().basePath("/api/v1");

app.route("/pages", nftsRouter);

serve({
    fetch: app.fetch,
    port: 3000,
});
