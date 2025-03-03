import { useCallback, useInsertionEffect, useRef } from "react";

export function useEvent<T extends (...args: any[]) => any>(fn: T) {
    const cbRef = useRef(fn);

    // updating refs inside of the render might
    // lead to incorrect behavior. there for we
    // use effect that happens earliest
    useInsertionEffect(() => {
        cbRef.current = fn;
    }, [fn]);

    const eventCb = useCallback((...args: Parameters<T>): ReturnType<T> => {
        return cbRef.current(...args);
    }, []);

    return eventCb;
}
