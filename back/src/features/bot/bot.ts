import { Telegraf } from "telegraf";
import { testLuckMiddleware } from "./test-luck-middleware.js";
import { startMarkup, BUTTON_ACTIONS, menuButton } from "./markup.js";
import { getEnv } from "../../shared/utils/get-env.js";

export const bot = new Telegraf(getEnv().BOT_TOKEN);

bot.telegram.setChatMenuButton({
    menuButton,
});

bot.command("start", (ctx) => {
    ctx.reply("Welcome to the NFT Marketplace bot!", startMarkup);
});

bot.action(BUTTON_ACTIONS.TEST_LUCK, testLuckMiddleware);
