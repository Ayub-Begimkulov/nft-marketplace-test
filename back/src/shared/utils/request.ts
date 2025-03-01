type RequestOptions = {
    body?: Record<string, any>;
    query?: Record<string, string | number | Array<string | number>>;
};

export function request(url: string, init?: RequestInit) {
    return fetch(url, {
        ...init,
        body: JSON.stringify(init?.body),
    });
}
