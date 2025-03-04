import { isString } from "./is-string.js";

export function getPort(portEnv: string | undefined, defaultPort: number) {
    if (!isString(portEnv)) {
        return defaultPort;
    }

    const parsedPort = parseInt(portEnv, 10);

    if (Number.isNaN(parsedPort)) {
        return defaultPort;
    }

    return parsedPort;
}
