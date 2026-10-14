import { buildLegacyTheme } from "sanity";

// Copie de la palette du site (src/styles/config/_variables.scss) :
// le Studio est un projet séparé qui ne peut pas lire le SCSS.
// Toute modification de couleur doit être faite aux deux endroits.
const charte = {
  ecruFonce: "#f4f1ea",
  terreClair: "#726a62",
  terreFonce: "#453e39",
  saugeFonce: "#748a70",
  terracotta: "#a84a32",
};

// Sanity déduit tout son thème de ces quelques couleurs de base
// (« black » = couleur du texte, « white » = couleur du fond).
// Les couleurs « warning » et « info » gardent la valeur de Sanity :
// la charte n'en prévoit pas.
export const theme = buildLegacyTheme({
  "--black": charte.terreFonce,
  "--white": charte.ecruFonce,
  "--gray-base": charte.terreClair,
  "--gray": charte.terreClair,
  "--component-bg": charte.ecruFonce,
  "--component-text-color": charte.terreFonce,
  "--brand-primary": charte.saugeFonce,
  "--default-button-primary-color": charte.saugeFonce,
  "--default-button-success-color": charte.saugeFonce,
  "--default-button-danger-color": charte.terracotta,
  "--state-success-color": charte.saugeFonce,
  "--state-danger-color": charte.terracotta,
  "--focus-color": charte.saugeFonce,
  "--main-navigation-color": charte.terreFonce,
  "--main-navigation-color--inverted": charte.ecruFonce,
});
