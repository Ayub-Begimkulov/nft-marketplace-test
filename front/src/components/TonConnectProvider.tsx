import {
    TonConnectUIProvider,
    TonConnectUIProviderProps,
} from "@tonconnect/ui-react";

export function TonConnectProvider({
    children,
    ...rest
}: TonConnectUIProviderProps) {
    return (
        <TonConnectUIProvider
            manifestUrl="https://violet-traditional-rabbit-103.mypinata.cloud/ipfs/QmQJJAdZ2qSwdepvb5evJq7soEBueFenHLX3PoM6tiBffm"
            {...rest}
        >
            {children}
        </TonConnectUIProvider>
    );
}
