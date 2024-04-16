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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const openai_1 = require("openai");
//@ts-ignore
const openai = new openai_1.OpenAI(process.env.OPENAI_API_KEY);
function tepenator(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.reply("Welcome to the Tepenator,please enter the prompt for your meme");
        const { message } = yield conversation.wait();
        if (!(message === null || message === void 0 ? void 0 : message.text)) {
            yield ctx.reply("Please enter a valid prompt");
            return;
        }
        const prompt = `Generate a blue meme frog, ${message.text},ensure the frog is blue, use the most famous meme frog, make it funny and relatable to the prompt`;
        //call the openai api to generate the meme
        const response = yield openai.images.generate({
            prompt: prompt,
            model: "dall-e-3",
            n: 1,
            size: "1024x1024",
            quality: "standard",
        });
        const image_url = response.data[0].url;
        console.log(image_url);
        console.log(response);
        if (!image_url) {
            return yield ctx.reply("Sorry, I couldn't generate a meme for you, please try again later");
        }
        yield ctx.replyWithPhoto(image_url);
    });
}
exports.default = tepenator;
