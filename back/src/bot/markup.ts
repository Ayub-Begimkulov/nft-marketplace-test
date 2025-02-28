import { Markup } from "telegraf";

export const BUTTON_ACTIONS = {
    TEST_LUCK: "test_luck",
};

const openAppButton = Markup.button.webApp(
    "Open App! 🚀",
    "https://a05f-213-206-60-110.ngrok-free.app/",
);
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
