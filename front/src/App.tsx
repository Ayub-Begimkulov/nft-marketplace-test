import { Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectProvider } from "./shared/components/TonConnectProvider";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { AuthOnly, GuestOnly } from "./shared/components/RouteGuards";

const queryClient = new QueryClient();

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    );
}
