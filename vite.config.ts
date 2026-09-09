import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pagesBase = (globalThis as { process?: { env?: { BASE_URL?: string } } }).process?.env?.BASE_URL;

export default defineConfig({
  base: pagesBase || "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        trainings: "treinamentos/index.html",
        privacy: "privacidade/index.html",
      },
    },
  },
});
