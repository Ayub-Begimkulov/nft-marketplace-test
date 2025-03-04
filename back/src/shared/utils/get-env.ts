import dotenv from "dotenv";

const REQUIRED_ENV = [
    "BOT_TOKEN",
    "REDIS_URL",
    "NOTION_API_KEY",
    "NOTION_PAGE_ID",
    "TG_WEB_APP_URL",
] as const;

type EnvKeys = (typeof REQUIRED_ENV)[number];
type EnvConfig = Record<EnvKeys, string>;

let loadedConfig: EnvConfig | undefined = undefined;

export function getEnv(): EnvConfig {
    if (loadedConfig) {
        return loadedConfig;
    }

    dotenv.config();

    const config = {} as EnvConfig;

    REQUIRED_ENV.forEach((key) => {
        const value = process.env[key];

        if (!value) {
            throw new Error(
                `Failed to load "${key}" from env. Make sure that you added it to .env file.`,
            );
        }

        config[key] = value;
    });

    loadedConfig = config;

    return loadedConfig;
}
