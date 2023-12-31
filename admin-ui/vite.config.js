import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "production") {
    const homepage = "https://airdrop.rsgis.dev/admin";
    return {
      base: `${homepage}/`,
      server: {
        host: true,
        origin: `${homepage}`,
      },
      define: {
        __APP_NAME__: `"${pkg.name}"`,
        __APP_VERSION__: `"${pkg.version}"`,
        __API_ROOT__: `"https://airdrop.rsgis.dev"`,
        __HOMEPAGE__: `"${homepage}"`,
      },
      plugins: [react()],
    };
  } else {
    return {
      server: {
        port: 5174,
      },
      define: {
        __APP_NAME__: `"${pkg.name}"`,
        __APP_VERSION__: `"${pkg.version}"`,
        __API_ROOT__: `"http://localhost:3000"`,
        __HOMEPAGE__: `"http://localhost:5174"`,
      },
      plugins: [react()],
    };
  }
});
