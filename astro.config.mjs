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
  // Images responsives pour tout le site : chaque <Image> reçoit plusieurs tailles
  // (srcset) et le navigateur télécharge celle qui correspond à l'écran, au lieu
  // de la photo originale en 4000 px.
  image: {
    layout: "constrained",
  },
  // CSS écrit directement dans chaque page : une requête bloquante de moins avant
  // l'affichage. Le CSS du site est léger, le perdre du cache coûte peu.
  build: {
    inlineStylesheets: "always",
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
