import { Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { AuthOnly, GuestOnly } from "./shared/components/RouteGuards";
import { Layout } from "./shared/components/Layout";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const queryClient = new QueryClient();
const MANIFEST =
    "https://raw.githubusercontent.com/Ayub-Begimkulov/nft-marketplace-test/main/logo.png";

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TonConnectUIProvider manifestUrl={MANIFEST}>
                <Layout>
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
                </Layout>
            </TonConnectUIProvider>
        </QueryClientProvider>
    );
}
