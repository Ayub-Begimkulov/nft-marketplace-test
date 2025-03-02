import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { bot } from "./features/bot/index.js";
import { nftsRouter } from "./features/nfts/index.js";

bot.launch(() => {
    console.log("Bot is running...");
});

const app = new Hono().basePath("/api/v1");

app.route("/nfts", nftsRouter);

serve({
    fetch: app.fetch,
    port: 3000,
});
