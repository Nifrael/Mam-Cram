// @ts-check
import { defineConfig } from "astro/config";
import { fontProviders } from "astro/config";
import { fileURLToPath } from "node:url";

// https://astro.build/config
export default defineConfig({
  // Alias pour Vite (utilisés par Sass dans les `@use`). Le pendant TypeScript est dans tsconfig.json.
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Vollkorn",
      cssVariable: "--font-title",
      weights: ["400", "600"],
    },
    {
      provider: fontProviders.google(),
      name: "Nunito Sans",
      cssVariable: "--font-text",
      weights: ["200", "400"],
    },
  ],
});
