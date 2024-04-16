import { MyContext, MyConversation } from "../bot";
import * as dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";
//@ts-ignore
const openai = new OpenAI(process.env.OPENAI_API_KEY);
async function tepenator(conversation: MyConversation, ctx: MyContext) {
	await ctx.reply(
		"Welcome to the Tepenator,please enter the prompt for your meme"
	);
	const { message } = await conversation.wait();
	if (!message?.text) {
		await ctx.reply("Please enter a valid prompt");
		return;
	}

	const prompt = `Generate a blue meme frog, ${message.text},ensure the frog is blue, use the most famous meme frog, make it funny and relatable to the prompt`;
	//call the openai api to generate the meme
	const response = await openai.images.generate({
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
		return await ctx.reply(
			"Sorry, I couldn't generate a meme for you, please try again later"
		);
	}
	await ctx.replyWithPhoto(image_url);
}

export default tepenator;
