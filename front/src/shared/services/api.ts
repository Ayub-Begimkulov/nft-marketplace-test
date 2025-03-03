import ky from "ky";

const TIMEOUT = 30_000;

export const api = ky.create({
    timeout: TIMEOUT,
    prefixUrl: import.meta.env.VITE_API_URL,
});
