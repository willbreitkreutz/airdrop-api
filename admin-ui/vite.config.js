import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "production") {
    const homepage = "https://icejam.rsgis.dev";
    return {
      server: {
        host: true,
        origin: `${homepage}`,
      },
      define: {
        __APP_NAME__: `"${pkg.name}"`,
        __APP_VERSION__: `"${pkg.version}"`,
        __HOMEPAGE__: `"${homepage}"`,
        __API_ROOT__: `"${homepage}/api/v1"`,
        __AUTH_ROOT__: `"https://identityc-test.cwbi.us/auth"`,
        __AUTH_REALM__: `"cwbi"`,
        __AUTH_CLIENT_ID__: `"icejam"`,
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
      },
      plugins: [react()],
    };
  }
});
