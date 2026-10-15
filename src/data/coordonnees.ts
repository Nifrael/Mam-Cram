import type { NomIcone } from "@/components/UI/Icone.astro";

export const email = "contact@mamcram.fr";

export const telephone = {
  affiche: "06 12 34 56 78",
  lien: "tel:+33612345678",
};

export const reseaux = {
  instagram: {
    url: "https://www.instagram.com/mamcram66/",
    texte: "Instagram",
  },
  facebook: { url: "https://www.facebook.com/", texte: "Facebook" },
  leboncoin: {
    url: "https://www.leboncoin.fr/profile/1e85dd81-24e9-4cc1-bb58-620994ec1fc5/offers",
    texte: "Le Bon Coin",
  },
};

/** Réseaux avec leur icône, dans l'ordre d'affichage (pied de page et menu mobile). */
export const listeReseaux: { url: string; texte: string; icone: NomIcone }[] = [
  { ...reseaux.instagram, icone: "instagram" },
  { ...reseaux.facebook, icone: "facebook" },
  { ...reseaux.leboncoin, icone: "leboncoin" },
];
