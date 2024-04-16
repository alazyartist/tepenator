"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const dotenv = __importStar(require("dotenv"));
const conversations_1 = require("@grammyjs/conversations");
const grammy_1 = require("grammy");
const auto_retry_1 = require("@grammyjs/auto-retry");
const menu_1 = require("@grammyjs/menu");
const runner_1 = require("@grammyjs/runner");
const grammy_middlewares_1 = require("grammy-middlewares");
const transformer_throttler_1 = require("@grammyjs/transformer-throttler");
const tepenator_1 = __importDefault(require("./commands/tepenator"));
const makeItBlue_1 = __importStar(require("./commands/makeItBlue"));
dotenv.config();
const BOT_TOKEN = process.env.MODE === "DEV"
    ? process.env.TELEGRAM_TEPE_TOKEN
    : process.env.TELEGRAM_TEPE_TOKEN;
exports.bot = new grammy_1.Bot(BOT_TOKEN);
const throttler = transformer_throttler_1.apiThrottler();
exports.bot.api.config.use(throttler);
// Use the plugin.
exports.bot.api.config.use(auto_retry_1.autoRetry({
    maxRetryAttempts: 4,
    maxDelaySeconds: 1200,
}));
exports.bot.use(grammy_middlewares_1.ignoreOld(600));
exports.bot.use(grammy_1.session({ initial: () => ({}) }));
exports.bot.use(conversations_1.conversations());
exports.bot.api.getMe().then(console.log).catch(console.error);
// bot.use(createConversation(caSetup));
exports.bot.use(conversations_1.createConversation(tepenator_1.default));
exports.bot.use(conversations_1.createConversation(makeItBlue_1.default));
exports.bot.api.setMyCommands([
    { command: "start", description: "Start the Tepenator" },
    { command: "makeitblue", description: "Make it blue" },
    { command: "getshilled", description: "Informations" },
    // { command: "about", description: "Get information about a token" },
    // { command: "ape", description: "Make Aping Easy AF" },
    // { command: "top", description: "Get Top Pools on TON" },
    // { command: "ca", description: "Setup a contract address" },
    // { command: "all", description: "List all commands" },
]);
exports.bot.command("makeitblue", (ctx) => ctx.conversation.enter("makeItBlue"));
const menu = new menu_1.Menu("main-menu")
    .text("Informations", (ctx) => makeItBlue_1.getShilled(ctx))
    .text("Make It Blue", (ctx) => ctx.conversation.enter("makeItBlue"));
exports.bot.use(menu);
// bot.command("start", (ctx) => ctx.conversation.enter("tepenator"));
exports.bot.command("start", (ctx) => {
    ctx.replyWithPhoto(new grammy_1.InputFile("./tepe.jpg"), {
        caption: "Welcome to the Tepenator",
        reply_markup: menu,
    });
});
exports.bot.command("getshilled", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield makeItBlue_1.getShilled(ctx);
}));
exports.bot.catch((err) => {
    err.ctx.reply("An error occurred, please try again, if the error persists, contact the dev @alazyartist");
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
runner_1.run(exports.bot);
