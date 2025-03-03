import { useTonConnectUI, useIsConnectionRestored } from "@tonconnect/ui-react";
import { useEffect, useReducer } from "react";

export function useAuthStatus() {
    const [tonConnectUI] = useTonConnectUI();
    const connectionRestored = useIsConnectionRestored();
    const [, forceRerender] = useReducer((v) => v + 1, 0);

    useEffect(() => {
        return tonConnectUI.onStatusChange(() => {
            // when user logs in/out `tonConnectUI.account`
            // is also updated. but out component isn't rerendered.
            // therefor we must force rerender by hand
            forceRerender();
        });
    }, [tonConnectUI]);

    if (!connectionRestored) {
        return "loading";
    }

    if (tonConnectUI.account) {
        return "authorized";
    } else {
        return "unauthorized";
    }
}
