// @ts-check
import { defineConfig, envField } from "astro/config";
import { fontProviders } from "astro/config";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

// astro.config.mjs est lu avant le build : `astro:env` n'y existe pas encore.
// loadEnv lit le fichier .env et les variables de l'hébergeur (process.env).
const { URL_SITE } = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  // Adresse du site : sert au sitemap, et plus tard aux URL canoniques.
  site: URL_SITE,
  // Le sitemap liste les pages indexables ; la page de remerciement n'a rien à faire dedans.
  // Keystatic ajoute l'interface /keystatic, faite en React : React n'est chargé
  // que sur cette page, jamais sur les pages publiques.
  integrations: [sitemap({ filter: (page) => !page.includes("/contact/merci") }), react(), keystatic()],
  // Toutes les pages restent générées au build (sortie statique). L'adaptateur ne sert
  // qu'aux routes de Keystatic (/keystatic, /api/keystatic) qui tournent côté serveur,
  // dans un Worker Cloudflare : connexion des clients et commits vers GitHub.
  // `compile` : les images sont optimisées au build, comme avant, sans le service
  // payant Cloudflare Images.
  // En dev (`npm run dev`), pas d'adaptateur : l'API Keystatic tourne dans Node, seul
  // environnement où le mode `local` peut écrire dans src/content/. Avec l'adaptateur,
  // elle tournerait dans workerd (le moteur Cloudflare) et planterait.
  adapter: process.env.NODE_ENV === "development" ? undefined : cloudflare({ imageService: "compile" }),
  // Le site n'utilise pas les sessions Astro (Keystatic gère sa connexion lui-même).
  // Sans cette ligne, l'adaptateur Cloudflare réserve une base KV « SESSION » sans
  // identifiant, ce qui fait échouer les déploiements d'aperçu (branches hors master).
  session: false,
  vite: {
    // L'interface Keystatic pèse environ 2,7 Mo : Vite avertit au-delà de 500 ko. Elle n'est
    // chargée que sur /keystatic, jamais par les visiteurs : on relève le seuil pour elle.
    build: { chunkSizeWarningLimit: 3000 },
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
