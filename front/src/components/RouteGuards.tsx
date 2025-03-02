import { useTonConnectUI, useIsConnectionRestored } from "@tonconnect/ui-react";
import { Redirect } from "wouter";

function useAuthStatus() {
    const [tonConnectUI] = useTonConnectUI();
    const connectionRestored = useIsConnectionRestored();

    if (!connectionRestored) {
        return "loading";
    }

    if (tonConnectUI.account) {
        return "authorized";
    } else {
        return "unauthorized";
    }
}

export function AuthOnly(props: React.PropsWithChildren) {
    const status = useAuthStatus();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "unauthorized") {
        return <Redirect to="/login" />;
    }

    return props.children;
}

export function GuestOnly(props: React.PropsWithChildren) {
    const status = useAuthStatus();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "authorized") {
        return <Redirect to="/" />;
    }

    return props.children;
}
