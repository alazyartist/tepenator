"use strict";
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
exports.getShilled = void 0;
const canvas_1 = require("canvas");
const grammy_1 = require("grammy");
function makeItBlue(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.reply("Welcome to the Make it Blue, please upload an image to make it blue");
        const { message } = yield conversation.waitFor(":photo");
        if (!(message === null || message === void 0 ? void 0 : message.photo)) {
            yield ctx.reply("Please upload a valid image");
            return;
        }
        const file_id = message.photo[message.photo.length - 1].file_id;
        const photo = yield ctx.api.getFile(file_id);
        console.log(message);
        console.log(photo);
        yield ctx.reply("Processing your image, please wait");
        yield ctx.replyWithChatAction("upload_photo");
        const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TEPE_TOKEN}/${photo.file_path}`;
        console.log(url);
        yield processImage(url, ctx);
    });
}
exports.default = makeItBlue;
function processImage(photo, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        canvas_1.registerFont("./Mabook.ttf", { family: "Mabook" });
        const image = yield canvas_1.loadImage(photo);
        const canvas = canvas_1.createCanvas(image.width, image.height);
        const cctx = canvas.getContext("2d");
        cctx.drawImage(image, 0, 0);
        cctx.font = `${image.width * 0.4} "Mabook"`;
        cctx.fillStyle = "white";
        cctx.fillText("TEPE", 10, image.height - 50);
        const imageData = cctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            //turn the green pixels to blue
            // data[i] ;
            // data[i + 1]
            if (data[i] < 25 && data[i + 1] < 25 && data[i + 2] < 25) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            }
            else {
                if (data[i] < 150 && data[i + 1] > 130 && data[i + 2] < 130) {
                    data[i + 2] = 255;
                }
                if (data[i] < 100 && data[i + 1] > data[i] && data[i + 1] > data[i + 2]) {
                    data[i + 1] = data[i + 1] - 75;
                    data[i + 2] = 255;
                }
                if (data[i + 1] > 150 && data[i] < 150 && data[i + 2] < 150) {
                    data[i + 1] = data[i + 1] - 125;
                    data[i + 2] = 255;
                }
            }
        }
        cctx.putImageData(imageData, 0, 0);
        const buffer = canvas.toBuffer();
        yield ctx.replyWithPhoto(new grammy_1.InputFile(buffer));
        yield getShilled(ctx);
    });
}
function getShilled(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        // const baseURL = 'https://app.ston.fi/swap';
        // const params = {
        //     ft: 'TON',
        //     tt: 'EQDN11TTPTxw_xSPJs_zyrzIRml4JXDlppAmYzJq--tmpA6V',
        //     fa: '5',
        //     chartVisible: 'false'
        // };
        // const encodedURL = `${baseURL}?${Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&')}`;
        // console.log(encodedURL);
        const tepekeyboard = new grammy_1.InlineKeyboard()
            .url("Buy $TEPE", "https://app.ston.fi/swap?&ft=TON&tt=EQDN11TTPTxw_xSPJs_zyrzIRml4JXDlppAmYzJq--tmpA6V&fa=5&chartVisible=false")
            .row()
            .url("Website", "https://www.tepeton.com/")
            .row()
            .url("Telegram", "https://t.me/TEPEONTONN")
            .url("Twitter", "https://twitter.com/ton_tepe");
        const tepeMessage = `
<b>$TEPE</b> 🐸  
not just another token, but the embodiment of meme greatness on TON!  🔥  
And behind this stands a passionate team of Devs committed to pushing this project forward ⬆️. 
With this mix, the possibilities are endless.  🕺   
Do not miss out – grab your share of the $TEPE 🐸 today!
Tap to copy ca:
<code>EQDN11TTPTxw_xSPJs_zyrzIRml4JXDlppAmYzJq--tmpA6V</code>
        `;
        yield ctx.replyWithPhoto(new grammy_1.InputFile("./tepeface.jpg"), {
            caption: tepeMessage,
            parse_mode: "HTML",
            reply_markup: tepekeyboard,
        });
    });
}
exports.getShilled = getShilled;
