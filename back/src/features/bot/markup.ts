import { Markup } from "telegraf";
import { MenuButton } from "telegraf/types";
import { getEnv } from "../../shared/utils/get-env.js";

const webAppUrl = getEnv().TG_WEB_APP_URL;

export const BUTTON_ACTIONS = {
    TEST_LUCK: "test_luck",
};

export const menuButton: MenuButton = {
    type: "web_app",
    text: "Open! 🚀",
    web_app: {
        url: webAppUrl,
    },
};

const openAppButton = Markup.button.webApp("Open App! 🚀", webAppUrl);
const checkSourceButton = Markup.button.url(
    "Check Source Code! 💻",
    "https://github.com/Ayub-Begimkulov/nft-marketplace-test",
);
const testLuckButton = Markup.button.callback(
    "Test Luck! 🎲",
    BUTTON_ACTIONS.TEST_LUCK,
);

export const startMarkup = Markup.inlineKeyboard([
    [openAppButton],
    [checkSourceButton],
    [testLuckButton],
]);

export const testLuckMarkup = Markup.inlineKeyboard([
    [openAppButton],
    [checkSourceButton],
]);
