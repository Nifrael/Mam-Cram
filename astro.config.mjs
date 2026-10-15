// @ts-check
import { defineConfig, envField } from "astro/config";
import { fontProviders } from "astro/config";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

// astro.config.mjs est lu avant le build : `astro:env` n'y existe pas encore.
// loadEnv lit le fichier .env et les variables de l'hébergeur (process.env).
const { URL_SITE } = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

// ESSAI KEYSTATIC (mode local) : l'interface /keystatic n'existe qu'avec `npm run dev`.
// Le site construit reste 100 % statique, sans React ni adaptateur.
const enDev = process.argv.includes("dev");

// https://astro.build/config
export default defineConfig({
  // Adresse du site : sert au sitemap, et plus tard aux URL canoniques.
  site: URL_SITE,
  // Le sitemap liste les pages indexables ; la page de remerciement n'a rien à faire dedans.
  integrations: [
    sitemap({ filter: (page) => !page.includes("/contact/merci") }),
    ...(enDev ? [react(), keystatic()] : []),
  ],
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
      // Interrupteur d'indexation : false tant que le site est en test (fausses données).
      INDEXATION: envField.boolean({ context: "server", access: "public", default: false }),
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
