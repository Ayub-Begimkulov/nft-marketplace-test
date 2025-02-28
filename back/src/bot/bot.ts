import { Telegraf } from "telegraf";
import { testLuckMiddleware } from "./test-luck-middleware";
import { startMarkup, BUTTON_ACTIONS } from "./markup";
import { getEnv } from "../utils/get-env";

export const bot = new Telegraf(getEnv().BOT_TOKEN);

bot.command("start", (ctx) => {
    ctx.reply("Welcome to the NFT Marketplace bot!", startMarkup);
});

bot.action(BUTTON_ACTIONS.TEST_LUCK, testLuckMiddleware);
