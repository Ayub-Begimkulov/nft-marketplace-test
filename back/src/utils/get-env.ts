import dotenv from "dotenv";

const REQUIRED_ENV = ["BOT_TOKEN"] as const;

type EnvKeys = (typeof REQUIRED_ENV)[number];
type EnvConfig = Record<EnvKeys, string>;

let loadedConfig: EnvConfig | undefined = undefined;

export function getEnv(): EnvConfig {
    if (loadedConfig) {
        return loadedConfig;
    }

    const config = dotenv.config().parsed;

    if (!config) {
        throw new Error("Failed to load .env config.");
    }

    REQUIRED_ENV.forEach((key) => {
        if (!config[key]) {
            throw new Error(
                `Failed to load "${key}" from env. Make sure that you added it to .env file.`,
            );
        }
    });

    loadedConfig = config as EnvConfig;

    return loadedConfig;
}
