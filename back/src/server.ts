import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { testLuckMiddleware } from "./test-luck-middleware";
import { startMarkup, BUTTON_ACTIONS } from "./markup";

const config = dotenv.config().parsed;
const BOT_TOKEN = config ? config.BOT_TOKEN : undefined;

if (!BOT_TOKEN) {
    throw new Error(
        "Failed to load `BOT_TOKEN` from env. Make sure that you added it to .env file.",
    );
}

const bot = new Telegraf(BOT_TOKEN);

bot.command("start", (ctx) => {
    ctx.reply("Welcome to the NFT Marketplace bot!", startMarkup);
});

bot.action(BUTTON_ACTIONS.OPEN_APP, (ctx) => {
    ctx.reply("It doesn't work right now...");
});

bot.action(BUTTON_ACTIONS.TEST_LUCK, testLuckMiddleware);

bot.launch(() => {
    console.log("Bot is running...");
});
