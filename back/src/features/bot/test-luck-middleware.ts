import { Context } from "telegraf";
import { testLuckMarkup } from "./markup.js";

const diceEmoji = [
    {
        emoji: "🏀",
        check(value: number) {
            return value >= 4;
        },
    },
    {
        emoji: "⚽",
        check(value: number) {
            return value >= 3;
        },
    },
    {
        emoji: "🎯",
        check(value: number) {
            return value >= 6;
        },
    },
    {
        emoji: "🎳",
        check(value: number) {
            return value >= 6;
        },
    },
];

export async function testLuckMiddleware(ctx: Context) {
    const randomIndex = random(0, diceEmoji.length - 1);
    const randomDice = diceEmoji[randomIndex]!;

    const msg = await ctx.replyWithDice({
        emoji: randomDice.emoji,
    });

    await sleep(2_000);

    if (randomDice.check(msg.dice.value)) {
        ctx.reply(
            "You got lucky this time! Now it's time to check my app)",
            testLuckMarkup,
        );
    } else {
        ctx.reply("No worries, you can check the app!", testLuckMarkup);
    }
}

function sleep(ms: number) {
    return new Promise<void>((res) => {
        setTimeout(() => {
            res();
        }, ms);
    });
}

function random(min: number, max: number) {
    return min + Math.floor((max - min + 1) * Math.random());
}
