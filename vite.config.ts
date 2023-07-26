import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      routes: `${path.resolve(__dirname, "./src/routes/")}`,
      services: `${path.resolve(__dirname, "./src/services/")}`,
      pages: `${path.resolve(__dirname, "./src/pages/")}`,
      components: `${path.resolve(__dirname, "./src/components/")}`,
      assets: `${path.resolve(__dirname, "./src/assets/")}`,
      store: `${path.resolve(__dirname, "./src/store/")}`,
    },
  },
});
