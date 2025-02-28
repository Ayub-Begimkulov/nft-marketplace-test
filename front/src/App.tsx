import { Main } from "./components/Main";
import { TonConnectProvider } from "./components/TonConnectProvider";

export function App() {
    return (
        <TonConnectProvider>
            <Main />
        </TonConnectProvider>
    );
}
