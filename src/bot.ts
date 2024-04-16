import * as dotenv from "dotenv";
import {
	type Conversation,
	type ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
import {
	Bot,
	Context,
	Composer,
	session,
	NextFunction,
	InputFile,
} from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { Menu } from "@grammyjs/menu";
import { run } from "@grammyjs/runner";
import { ignoreOld } from "grammy-middlewares";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import tepenator from "./commands/tepenator";
import makeItBlue, { getShilled } from "./commands/makeItBlue";
dotenv.config();

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;
const BOT_TOKEN =
	process.env.MODE === "DEV"
		? process.env.TELEGRAM_TEPE_TOKEN
		: process.env.TELEGRAM_TEPE_TOKEN;
export const bot = new Bot<MyContext>(BOT_TOKEN as string);
const throttler = apiThrottler();
bot.api.config.use(throttler);
// Use the plugin.
bot.api.config.use(
	autoRetry({
		maxRetryAttempts: 4,
		maxDelaySeconds: 1200,
	})
);
bot.use(ignoreOld(600));

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.api.getMe().then(console.log).catch(console.error);
// bot.use(createConversation(caSetup));
bot.use(createConversation(tepenator));
bot.use(createConversation(makeItBlue));

bot.api.setMyCommands([
	{ command: "start", description: "Start the Tepenator" },
	{ command: "makeitblue", description: "Make it blue" },
	{ command: "getshilled", description: "Informations" },
	// { command: "about", description: "Get information about a token" },
	// { command: "ape", description: "Make Aping Easy AF" },
	// { command: "top", description: "Get Top Pools on TON" },
	// { command: "ca", description: "Setup a contract address" },
	// { command: "all", description: "List all commands" },
]);
bot.command("makeitblue", (ctx) => ctx.conversation.enter("makeItBlue"));
const menu = new Menu<MyContext>("main-menu")
	.text("Informations", (ctx) => getShilled(ctx))
	.text("Make It Blue", (ctx) => ctx.conversation.enter("makeItBlue"));
bot.use(menu);
// bot.command("start", (ctx) => ctx.conversation.enter("tepenator"));
bot.command("start", (ctx) => {
	ctx.replyWithPhoto(new InputFile("./tepe.jpg"), {
		caption: "Welcome to the Tepenator",
		reply_markup: menu,
	});
});
bot.command("getshilled", async (ctx) => {
	await getShilled(ctx);
});
bot.catch((err) => {
	err.ctx.reply(
		"An error occurred, please try again, if the error persists, contact the dev @alazyartist"
	);
	console.error(`Error for ${err.ctx.update.message}`, err);
});

// bot.command("tip_bot_dev", (ctx) =>
// 	ctx.replyWithPhoto(new InputFile("./watchitpump.webp"), {
// 		caption: `That's so thoughtful of you, 😍😍
// 		You can tip the dev at the following addresses:
// 		<code>WATcHGu7tvKrwp8SzNyp4Z2mB4sSEC8w6AyAwfh28A5</code>
// 		`,
// 		reply_markup: menu,
// 	})
// );
// bot.command("ca", async (ctx) => {
// 	await ctx.conversation.enter("caSetup");
// });
run(bot);
export { MyContext, MyConversation };
