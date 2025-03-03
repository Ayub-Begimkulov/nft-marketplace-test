// just write to console since it's
// not a real world app
export const logger = {
    error: (...args: unknown[]) => {
        console.error(...args);
    },
};
