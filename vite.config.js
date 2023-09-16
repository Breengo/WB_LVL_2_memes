import { defineConfig } from "vite";

const config = defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});

export default config;
