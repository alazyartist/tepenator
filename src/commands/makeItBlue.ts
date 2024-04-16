import { MyContext, MyConversation } from "../bot";
import { createCanvas, loadImage, registerFont } from "canvas";
import { InputFile, InlineKeyboard } from "grammy";
export default async function makeItBlue(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply(
		"Welcome to the Make it Blue, please upload an image to make it blue"
	);
	const { message } = await conversation.waitFor(":photo");
	if (!message?.photo) {
		await ctx.reply("Please upload a valid image");
		return;
	}
	const file_id = message.photo[message.photo.length - 1].file_id;
	const photo = await ctx.api.getFile(file_id);
	console.log(message);
	console.log(photo);
	await ctx.reply("Processing your image, please wait");
	await ctx.replyWithChatAction("upload_photo");
	const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TEPE_TOKEN}/${photo.file_path}`;
	console.log(url);
	await processImage(url, ctx);
}

async function processImage(photo: string, ctx: MyContext) {
	registerFont("./Mabook.ttf", { family: "Mabook" });
	const image = await loadImage(photo);
	const canvas = createCanvas(image.width, image.height);
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
		} else {
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
	await ctx.replyWithPhoto(new InputFile(buffer));
	await getShilled(ctx);
}

export async function getShilled(ctx: MyContext) {
	// const baseURL = 'https://app.ston.fi/swap';
	// const params = {
	//     ft: 'TON',
	//     tt: 'EQDN11TTPTxw_xSPJs_zyrzIRml4JXDlppAmYzJq--tmpA6V',
	//     fa: '5',
	//     chartVisible: 'false'
	// };

	// const encodedURL = `${baseURL}?${Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&')}`;
	// console.log(encodedURL);

	const tepekeyboard = new InlineKeyboard()
		.url(
			"Buy $TEPE",
			"https://app.ston.fi/swap?&ft=TON&tt=EQDN11TTPTxw_xSPJs_zyrzIRml4JXDlppAmYzJq--tmpA6V&fa=5&chartVisible=false"
		)
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
	await ctx.replyWithPhoto(new InputFile("./tepeface.jpg"), {
		caption: tepeMessage,
		parse_mode: "HTML",
		reply_markup: tepekeyboard,
	});
}
