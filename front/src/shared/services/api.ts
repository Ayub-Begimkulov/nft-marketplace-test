import ky, { KyRequest, KyResponse, NormalizedOptions } from "ky";

const TIMEOUT = 30_000;

export const api = ky.create({
    timeout: TIMEOUT,
    prefixUrl: import.meta.env.VITE_API_URL,
    hooks: {
        afterResponse: [logAPIError],
    },
});

async function logAPIError(
    request: KyRequest,
    _options: NormalizedOptions,
    response: KyResponse,
) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(`[API ERROR]: ${request.url}`, {
            status: response.status,
            body: errorData,
        });
    }
}
