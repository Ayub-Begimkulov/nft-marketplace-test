import { TonConnectButton } from "@tonconnect/ui-react";

export function Login() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TonConnectButton />
        </div>
    );
}
