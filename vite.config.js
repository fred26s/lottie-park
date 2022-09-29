import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    assetsDir: "lottie-park/assets",
  },
  server: {
    port: 8849,
    proxy: {
      "/lottie-json": {
        target: "http://localhost:8848",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lottie-json/, "/lottie-json"),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
