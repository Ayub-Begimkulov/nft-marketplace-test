import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, "./");
    return {
        plugins: [react(), svgr()],
        server: {
            allowedHosts: true,
            proxy: {
                "/api": env.VITE_PROXY_URL,
            },
        },
    };
});
