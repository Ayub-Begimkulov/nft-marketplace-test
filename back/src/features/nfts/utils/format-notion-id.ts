export function formatNotionId(id: string) {
    if (!id || id.length !== 32) {
        throw new Error("Invalid Notion ID. It must be a 32-character string.");
    }

    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(
        16,
        20,
    )}-${id.slice(20)}`;
}
