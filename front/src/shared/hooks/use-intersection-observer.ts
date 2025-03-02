import { useCallback, useMemo, useRef } from "react";
import { useEvent } from "./use-event";

export function useIntersectionObserver(
    cb: (entry: IntersectionObserverEntry) => void,
    options?: IntersectionObserverInit,
) {
    const eventCb = useEvent(cb);
    const cleanupRef = useRef<VoidFunction | null>(null);

    const observer = useMemo(
        () =>
            new IntersectionObserver((entries) => {
                if (!entries[0]) {
                    return;
                }

                // this hook work only with one element
                eventCb(entries[0]);
            }, options),
        [eventCb, options],
    );

    const elementRef = useCallback(
        (element: HTMLElement | null) => {
            if (element) {
                observer.observe(element);
                cleanupRef.current = () => {
                    observer.unobserve(element);
                };
            } else {
                // we can use cleanup function for callback
                // refs in react 19, but it doesn't work with
                // `@tonconnect/ui-react`
                cleanupRef.current?.();
            }
        },
        [observer],
    );

    return elementRef;
}
