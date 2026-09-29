// @ts-check
import { defineConfig, envField } from "astro/config";
import { fontProviders } from "astro/config";
import { fileURLToPath } from "node:url";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      },
    },
  },
  env: {
    schema: {
      WEB3FORMS_CLE: envField.string({ context: "server", access: "public" }),
      URL_SITE: envField.string({ context: "server", access: "public", url: true }),
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
