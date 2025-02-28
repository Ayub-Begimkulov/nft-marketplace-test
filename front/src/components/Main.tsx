import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

const addresses = [
    "EQCCMrkQtSm5UL9Z963J-qCT3cUcdDq4_j-L-qnQu-stAHc_",
    "EQBrDW9gmTHEBtqfBujYYXoRiH1FybEuVFW8_6HJZ6UyQx2N",
    "EQC67RicSpi7a_s7ULYMRzcFt-XKNsdQOfZISN7pCFQL-8Ms",
    "EQAGCApwssMcC0MT5tnhF0_eBulMB9iU9I2l5OZd8ZTCzEnA",
    "EQAcWYauQmOjTn60TkHSqeaqnuWGGhqEf8ewZGiL37LBg5yo",
    "EQCCxzVmcW0f6frVsKTb0E5nMAcTC2o2907wIbAOCj7tBYRg",
    "EQA-S-WDMq34lFOB_Li0SpSyCbEB1SBrR66D7gSArTLAmqXm",
    "EQAdw9hJwSymoT2Vjh4rA1pz2Xifc7qNGy_NryrnsP1Q8ppG",
    "EQCt9lzd02F8UqSB0SyAPCCgTINnnMYHYFbUWd8VgLzeUXL8",
    "EQAXR72dxnl3ERBQos7Nok8mnBMGt-anJXrHG-pEcXutfr7s",
    "EQCUNh0Def4W0Xs88ZLisWLSUB_KhP8gtSS70UcKqb0p22j1",
    "EQDvOzZuJW-4RIuKdZ8VvxxHIIEjDnJ9Jo1pYJxr-t6roM9i",
    "EQAhne4d9SLXpSxZHSTa0MrnoVf_HyykVTs7mRXBpRj_35WN",
    "EQAEL6hfew7sP-B04905hsEj2Io9UbTv8bRlfGrcePxHpv9d",
    "EQCPLT6jZswEFa724GJtHYnlHo7zpJ9nXwAVOUprCQBwgRGs",
    "EQDIlm91sROp-JQ6d4WkjVhi7ZF-uHHgDy-dKbZE9zsuXvNy",
    "EQAIEXIOkbikNVVxc2HSFyXHfFm0d-zbLUyv2RKZvvIO6R-V",
    "EQDofgUWeO4HFrbLxBPkZFVm844cc-34Ir2JnrpHZeGpBCnz",
    "EQD7Eg3nD7TJQie5XdE9JgjJCFinLHAVV-k1G6HxFIHfN5Co",
    "EQDLA7pb7PIAl76etKs988JIpatxvYDGDrIyhAAt6yH4XGzV",
    "EQBmYG3RIis1QT6xo43LxOCVLHdm4YxAHR4GSE6pDhDuG_81",
    "EQBxZ5CjJpKDrJJqvdpXZ2phJDFVLnKyjkRWaZzDq7dIQBiQ",
    "EQCsmMzx6HzMvfcqFk9kDfsl-cSZJ2oi7WvuIa3GuXMzvRdN",
    "EQAoCYiUH6Yuyy4gR2ql9S7Hnm4tAZFgKEHLV7ePrLWAoqM0",
    "EQAQr7hhgZwsMUuz8oybcZNtd3mbeA5dRUy0jynECaibSpFq",
    "EQBEFhxV7o7ZtPP5fivxtSEX5wty0cspW3sisr3SYnv9en9X",
    "EQCIV6hE-HGM6QFs3I0aI5it64uBHuE7c05nvinXpWq53CzU",
    "EQAqG_XlqIbRp406Mtc60I2D7mMW0MX-rpBGB9TrvMHKV1bE",
];

export function Main() {
    const [tonConnectUI] = useTonConnectUI();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        tonConnectUI.connectionRestored.then((isRestored) => {
            console.log(isRestored ? "connected" : "not connected");
            setLoading(false);
        });
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {loading && <div>Loading...</div>}
            <TonConnectButton />
        </div>
    );
}
