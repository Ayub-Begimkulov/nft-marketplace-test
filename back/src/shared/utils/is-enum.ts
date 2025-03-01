export function isEnum<T extends string>(
    enumObj: Record<string, T>,
    value: string,
): value is T {
    return Object.values(enumObj).includes(value as T);
}
