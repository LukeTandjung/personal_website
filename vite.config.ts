import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const useTunnel = process.env.USE_TUNNEL === "1";

export default defineConfig({
  base: "/",
  server: {
    port: 3000,
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
