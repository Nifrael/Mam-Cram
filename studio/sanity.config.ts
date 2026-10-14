import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { frFRLocale } from "@sanity/locale-fr-fr";
import { actualite } from "./schemas/actualite";
import { theme } from "./theme";
import { Logo } from "./Logo";

export default defineConfig({
  name: "mamcram",
  title: "MAM'CRAM",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: "production",
  // structureTool : la liste des contenus à gauche, le formulaire à droite.
  // frFRLocale : boutons, menus et messages du Studio en français.
  plugins: [structureTool(), frFRLocale()],
  schema: { types: [actualite] },
  // Habillage aux couleurs de la charte et logo du site (voir theme.ts et Logo.tsx).
  theme,
  studio: { components: { logo: Logo } },
});
