declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TELEGRAM_TOKEN: string;
			TELEGRAM_TEPE_TOKEN: string;
			TELEGRAM_DEV_TOKEN: string;
			TONCENTER_TOKEN: string;
			UPSTASH_PASS: string;
			UPSTASH_URL: string;
			HELIUS_KEY: string;
			WEBHOOK_ID: string;
			WEBHOOK_URL: string;
			HELIUS_DEV_KEY: string;
			WEBHOOK_DEV_ID: string;
			WEBHOOK_DEV_URL: string;
			OPENAI_API_KEY: string;
			MODE: "DEV" | "PROD";
		}
	}
}

export {};
