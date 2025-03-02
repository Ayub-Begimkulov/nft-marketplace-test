import { TonConnectProvider } from "./components/TonConnectProvider";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { AuthOnly, GuestOnly } from "./components/RouteGuards";
import { Route } from "wouter";

export function App() {
    return (
        <TonConnectProvider>
            <Route path="/login">
                <GuestOnly>
                    <Login />
                </GuestOnly>
            </Route>
            <Route path="/">
                <AuthOnly>
                    <Home />
                </AuthOnly>
            </Route>
        </TonConnectProvider>
    );
}
